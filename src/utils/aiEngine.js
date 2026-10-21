import { GEM_TYPES } from './splendorData';

/**
 * Intelligent Splendor AI Bot Engine ("Athena")
 * Evaluates game state and picks the best legal move:
 * 1. Win if possible (buy 15+ pt card or noble-triggering card)
 * 2. Snipe/Block opponent from winning next turn
 * 3. Noble progression (cards providing gem colors needed for visible nobles)
 * 4. Engine building (efficient prestige-per-cost ratio or valuable permanent discounts)
 * 5. Reserve strategic high-value card if affordable soon or denying opponent
 * 6. Optimal gem collection (targeting shortages for top-priority card)
 */

// Helper to check if a player can afford a card
export function canAffordCard(player, card) {
  let wildcardsNeeded = 0;
  for (const [gemId, costAmount] of Object.entries(card.cost)) {
    const bonus = player.bonuses[gemId] || 0;
    const token = player.tokens[gemId] || 0;
    const effectiveCost = Math.max(0, costAmount - bonus);
    if (token < effectiveCost) {
      wildcardsNeeded += (effectiveCost - token);
    }
  }
  return (player.tokens.gold || 0) >= wildcardsNeeded;
}

// Calculate how many tokens the player still needs to buy a card
export function getMissingTokenCount(player, card) {
  let missing = 0;
  for (const [gemId, costAmount] of Object.entries(card.cost)) {
    const bonus = player.bonuses[gemId] || 0;
    const token = player.tokens[gemId] || 0;
    const effectiveCost = Math.max(0, costAmount - bonus);
    if (token < effectiveCost) {
      missing += (effectiveCost - token);
    }
  }
  // Subtract available gold wildcards
  return Math.max(0, missing - (player.tokens.gold || 0));
}

// Check if buying this card will immediately claim any noble
export function checkNobleClaimOnBuy(player, card, nobles) {
  const nextBonuses = { ...player.bonuses };
  nextBonuses[card.bonusGem] = (nextBonuses[card.bonusGem] || 0) + 1;

  for (const noble of nobles) {
    let satisfies = true;
    for (const [gemId, reqCount] of Object.entries(noble.requires)) {
      if ((nextBonuses[gemId] || 0) < reqCount) {
        satisfies = false;
        break;
      }
    }
    if (satisfies) {
      // Check if current player didn't already qualify before this card
      let alreadyHad = true;
      for (const [gemId, reqCount] of Object.entries(noble.requires)) {
        if ((player.bonuses[gemId] || 0) < reqCount) {
          alreadyHad = false;
          break;
        }
      }
      if (!alreadyHad) {
        return noble.points; // returns extra points (typically 3)
      }
    }
  }
  return 0;
}

// Evaluate strategic value score of a card for this player
export function evaluateCardValue(player, card, opponent, nobles) {
  let score = 0;

  // 1. Direct Prestige Points (heavily weighted)
  score += (card.prestige || 0) * 14;

  // 2. Immediate Noble Trigger bonus
  const nobleBonus = checkNobleClaimOnBuy(player, card, nobles);
  if (nobleBonus > 0) {
    score += nobleBonus * 16; // Massive priority!
  }

  // 3. Immediate Game Win condition
  if (player.score + (card.prestige || 0) + nobleBonus >= 15) {
    score += 1000; // Game-winning move!
  }

  // 4. Progress towards remaining Nobles
  for (const noble of nobles) {
    if (noble.requires[card.bonusGem]) {
      const current = player.bonuses[card.bonusGem] || 0;
      const needed = noble.requires[card.bonusGem];
      if (current < needed) {
        score += 8; // Good noble synergy
      }
    }
  }

  // 5. Total cost discount efficiency
  const totalCost = Object.values(card.cost).reduce((a, b) => a + b, 0);
  if (card.prestige > 0) {
    // Ratio of points per total resource
    score += (card.prestige / Math.max(1, totalCost)) * 12;
  } else {
    // Tier 1 engine building: cheaper cards get bonuses early
    score += Math.max(0, 10 - totalCost);
  }

  // 6. Denial: check if opponent is close to buying this or wants it for a noble
  if (opponent && opponent.score >= 10 && (card.prestige >= 3 || checkNobleClaimOnBuy(opponent, card, nobles) > 0)) {
    score += 15; // Denial priority
  }

  return score;
}

/**
 * Main AI Decision Function
 * Returns action object:
 * { type: 'BUY_CARD', card, fromReserved: boolean }
 * | { type: 'TAKE_GEMS', gems: string[] }
 * | { type: 'RESERVE_CARD', card }
 */
export function computeAiMove({ aiPlayer, humanPlayer, market, nobles, gemBank, difficulty = 'hard' }) {
  const allMarketCards = [
    ...(market[3] || []),
    ...(market[2] || []),
    ...(market[1] || [])
  ];

  const totalAiTokens = Object.values(aiPlayer.tokens).reduce((a, b) => a + b, 0);

  // 1. Check all immediately affordable cards (Market + AI's own reserved cards)
  const affordableReserved = (aiPlayer.reserved || []).filter(c => canAffordCard(aiPlayer, c));
  const affordableMarket = allMarketCards.filter(c => canAffordCard(aiPlayer, c));

  // Check if any affordable card wins the game right now!
  for (const card of [...affordableReserved, ...affordableMarket]) {
    const extraNoble = checkNobleClaimOnBuy(aiPlayer, card, nobles);
    if (aiPlayer.score + (card.prestige || 0) + extraNoble >= 15) {
      return {
        type: 'BUY_CARD',
        card,
        fromReserved: (aiPlayer.reserved || []).some(r => r.id === card.id)
      };
    }
  }

  // 2. Rank all affordable cards by strategic value
  const scoredAffordable = [
    ...affordableReserved.map(c => ({ card: c, fromReserved: true, score: evaluateCardValue(aiPlayer, c, humanPlayer, nobles) + 4 })),
    ...affordableMarket.map(c => ({ card: c, fromReserved: false, score: evaluateCardValue(aiPlayer, c, humanPlayer, nobles) }))
  ].sort((a, b) => b.score - a.score);

  // If we have an affordable high-value card (or in easy mode, some randomness)
  if (scoredAffordable.length > 0) {
    const bestAffordable = scoredAffordable[0];
    // If the top card has good value, buy it!
    if (bestAffordable.score >= 8 || totalAiTokens >= 8) {
      return {
        type: 'BUY_CARD',
        card: bestAffordable.card,
        fromReserved: bestAffordable.fromReserved
      };
    }
  }

  // 3. Find our Target Card to build towards:
  // Evaluate all market cards that we don't afford yet, sorted by desirability and proximity
  const futureCards = allMarketCards
    .map(card => {
      const missing = getMissingTokenCount(aiPlayer, card);
      const value = evaluateCardValue(aiPlayer, card, humanPlayer, nobles);
      // Desirability score adjusted by how few tokens we still lack
      const priority = value - (missing * 3);
      return { card, missing, value, priority };
    })
    .sort((a, b) => b.priority - a.priority);

  const target = futureCards[0];

  // 4. Opponent Denial Check: If opponent is about to win with a visible card, reserve it to block them!
  if (humanPlayer && humanPlayer.score >= 12 && (aiPlayer.reserved || []).length < 3) {
    const opponentThreat = allMarketCards.find(c => {
      const oppNoble = checkNobleClaimOnBuy(humanPlayer, c, nobles);
      return (humanPlayer.score + (c.prestige || 0) + oppNoble >= 15) && canAffordCard(humanPlayer, c);
    });
    if (opponentThreat) {
      return {
        type: 'RESERVE_CARD',
        card: opponentThreat
      };
    }
  }

  // 5. Reserve Strategy: If we have space (< 3 reserved), gold is available in bank, and target card is high tier
  if (
    (aiPlayer.reserved || []).length < 3 && 
    gemBank.gold > 0 && 
    target && 
    target.card.tier >= 2 && 
    target.value >= 25 &&
    target.missing <= 3 &&
    totalAiTokens < 10
  ) {
    return {
      type: 'RESERVE_CARD',
      card: target.card
    };
  }

  // If we still have an affordable card even with modest score, buy it if token hand is full
  if (scoredAffordable.length > 0 && totalAiTokens >= 7) {
    return {
      type: 'BUY_CARD',
      card: scoredAffordable[0].card,
      fromReserved: scoredAffordable[0].fromReserved
    };
  }

  // 6. Gem Collection Strategy: Take tokens to help buy our target card
  if (totalAiTokens < 10) {
    const regularGems = ['ruby', 'sapphire', 'emerald', 'amber', 'onyx'];
    
    // Check which specific gems the AI is missing for its target card
    const neededGems = [];
    if (target) {
      for (const [gemId, cost] of Object.entries(target.card.cost)) {
        const has = (aiPlayer.tokens[gemId] || 0) + (aiPlayer.bonuses[gemId] || 0);
        if (has < cost && (gemBank[gemId] || 0) > 0) {
          neededGems.push(gemId);
        }
      }
    }

    // Option A: Take 2 of same gem if needed and >= 4 available in bank
    for (const gemId of neededGems) {
      if ((gemBank[gemId] || 0) >= 4 && (10 - totalAiTokens) >= 2) {
        return {
          type: 'TAKE_GEMS',
          gems: [gemId, gemId]
        };
      }
    }

    // Option B: Take 3 distinct gems (prioritize needed ones, fill remaining with available gems)
    const distinctToTake = [];
    // First add needed ones that are available
    for (const gemId of neededGems) {
      if ((gemBank[gemId] || 0) > 0 && !distinctToTake.includes(gemId)) {
        distinctToTake.push(gemId);
        if (distinctToTake.length === 3 || totalAiTokens + distinctToTake.length >= 10) break;
      }
    }

    // If still room under max 3 and max 10 tokens, pick other available gems
    for (const gemId of regularGems) {
      if (distinctToTake.length >= 3 || totalAiTokens + distinctToTake.length >= 10) break;
      if (!distinctToTake.includes(gemId) && (gemBank[gemId] || 0) > 0) {
        distinctToTake.push(gemId);
      }
    }

    if (distinctToTake.length > 0) {
      return {
        type: 'TAKE_GEMS',
        gems: distinctToTake
      };
    }
  }

  // Fallback 1: Buy whatever we can afford
  if (scoredAffordable.length > 0) {
    return {
      type: 'BUY_CARD',
      card: scoredAffordable[0].card,
      fromReserved: scoredAffordable[0].fromReserved
    };
  }

  // Fallback 2: Reserve top market card
  if ((aiPlayer.reserved || []).length < 3 && allMarketCards.length > 0) {
    return {
      type: 'RESERVE_CARD',
      card: futureCards[0]?.card || allMarketCards[0]
    };
  }

  // Pass / do nothing if completely blocked
  return null;
}
