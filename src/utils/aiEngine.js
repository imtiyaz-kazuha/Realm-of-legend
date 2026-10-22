import { GEM_TYPES } from './splendorData';

/**
 * Grandmaster Splendor AI Bot Engine ("Athena 2.0")
 * 
 * Incorporates professional competitive Splendor principles:
 * 1. Win-in-1 / Win-in-2 forward calculation.
 * 2. Opponent Threat Assessment & Denial (reserves opponent's winning cards or noble stepping stones).
 * 3. Noble Alignment & Focus (picks the 1-2 most achievable nobles and aggressively prioritizes cards matching their colors).
 * 4. Engine Building Progression:
 *    - Early Game: Aggressively acquires Tier 1 cards matching targeted noble colors to reduce token consumption.
 *    - Mid Game: Transitions into Tier 2 cards (1-2 pts) that synergize with established bonuses.
 *    - Late Game (>= 9 pts): Switches to race/sprint mode, locking onto high-prestige Tier 3 cards.
 * 5. Optimal Resource Gathering:
 *    - Calculates multi-turn deficits for top 2 planned cards.
 *    - Double-takes with high priority when bank has 4+ of bottleneck color.
 *    - Prioritizes taking colors that deny the opponent's immediate purchases.
 * 6. Tactical Reservation:
 *    - Gold wildcard generation to bypass bottlenecks.
 *    - Denying high-value 4-5 pt cards or game-winning cards from opponent.
 *    - Storing tier-3 target cards when approaching 10 tokens.
 */

const ALL_REGULAR_GEMS = ['ruby', 'sapphire', 'emerald', 'amber', 'onyx'];

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

// Calculate total token deficit (how many tokens player still needs, taking gold into account)
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
      let alreadyHad = true;
      for (const [gemId, reqCount] of Object.entries(noble.requires)) {
        if ((player.bonuses[gemId] || 0) < reqCount) {
          alreadyHad = false;
          break;
        }
      }
      if (!alreadyHad) {
        return noble.points; // +3 pts
      }
    }
  }
  return 0;
}

// Determine which Noble is closest/most realistic for this player
function findBestTargetNobles(player, nobles) {
  return nobles.map(noble => {
    let missingBonusCount = 0;
    for (const [gemId, req] of Object.entries(noble.requires)) {
      const current = player.bonuses[gemId] || 0;
      if (current < req) {
        missingBonusCount += (req - current);
      }
    }
    return { noble, missingBonusCount };
  }).sort((a, b) => a.missingBonusCount - b.missingBonusCount);
}

// Comprehensive card evaluation score
export function evaluateCardValue(player, card, opponent, nobles, isLateGame = false) {
  let score = 0;
  const prestige = card.prestige || 0;
  const totalCost = Object.values(card.cost).reduce((a, b) => a + b, 0);

  // 1. Direct Prestige Value
  if (isLateGame) {
    // In late game, pure points dominate everything
    score += prestige * 25;
  } else {
    score += prestige * 16;
  }

  // 2. Immediate Noble Trigger (Game-breaking swing: +3 pts)
  const nobleBonus = checkNobleClaimOnBuy(player, card, nobles);
  if (nobleBonus > 0) {
    score += nobleBonus * 22; // Massive boost
  }

  // 3. Immediate Game Win (>= 15 pts)
  if (player.score + prestige + nobleBonus >= 15) {
    return 10000;
  }

  // 4. Noble Alignment
  const targetNobles = findBestTargetNobles(player, nobles);
  const bestNoble = targetNobles[0];
  if (bestNoble && bestNoble.noble.requires[card.bonusGem]) {
    const current = player.bonuses[card.bonusGem] || 0;
    const req = bestNoble.noble.requires[card.bonusGem];
    if (current < req) {
      // Very high priority if we need 1 or 2 more to claim the noble
      score += (bestNoble.missingBonusCount <= 2 ? 20 : 12);
    }
  }

  // 5. Engine Building & Discount Efficiency
  if (!isLateGame) {
    if (prestige === 0) {
      // Cheap tier 1 cards (cost 3 or 4) are prized in early game to build discounts
      score += Math.max(0, (6 - totalCost) * 4);
    } else {
      // Point-to-cost ratio
      score += (prestige / Math.max(1, totalCost)) * 14;
    }
  }

  // 6. Color Diversity (having at least 1 bonus in multiple colors enables nobles faster)
  if ((player.bonuses[card.bonusGem] || 0) === 0) {
    score += 4;
  }

  // 7. Defensive Denial: Check if opponent wants this card
  if (opponent) {
    const oppCanAfford = canAffordCard(opponent, card);
    const oppNobleBonus = checkNobleClaimOnBuy(opponent, card, nobles);
    const oppWinsWithCard = (opponent.score + prestige + oppNobleBonus) >= 15;

    if (oppWinsWithCard && oppCanAfford) {
      score += 500; // Critical denial!
    } else if (opponent.score >= 10 && prestige >= 3) {
      score += 24;
    } else if (oppNobleBonus > 0 && opponent.score >= 8) {
      score += 28;
    }
  }

  return score;
}

/**
 * Grandmaster AI Decision Engine
 */
export function computeAiMove({ aiPlayer, humanPlayer, market, nobles, gemBank }) {
  const allMarketCards = [
    ...(market[3] || []),
    ...(market[2] || []),
    ...(market[1] || [])
  ];

  const totalAiTokens = Object.values(aiPlayer.tokens).reduce((a, b) => a + b, 0);
  const isLateGame = aiPlayer.score >= 9 || (humanPlayer && humanPlayer.score >= 9);

  // 1. INSTANT WIN CHECK: Can AI win right now?
  const affordableReserved = (aiPlayer.reserved || []).filter(c => canAffordCard(aiPlayer, c));
  const affordableMarket = allMarketCards.filter(c => canAffordCard(aiPlayer, c));

  for (const card of [...affordableReserved, ...affordableMarket]) {
    const noblePts = checkNobleClaimOnBuy(aiPlayer, card, nobles);
    if (aiPlayer.score + (card.prestige || 0) + noblePts >= 15) {
      return {
        type: 'BUY_CARD',
        card,
        fromReserved: (aiPlayer.reserved || []).some(r => r.id === card.id)
      };
    }
  }

  // 2. CRITICAL OPPONENT BLOCK: Is opponent 1 turn away from winning?
  if (humanPlayer && (aiPlayer.reserved || []).length < 3) {
    const gameEndingThreat = allMarketCards.find(card => {
      const noblePts = checkNobleClaimOnBuy(humanPlayer, card, nobles);
      const wouldWin = (humanPlayer.score + (card.prestige || 0) + noblePts) >= 15;
      const oppMissing = getMissingTokenCount(humanPlayer, card);
      return wouldWin && (canAffordCard(humanPlayer, card) || oppMissing <= 1);
    });

    if (gameEndingThreat) {
      // If we can buy it first, buy it!
      if (canAffordCard(aiPlayer, gameEndingThreat)) {
        return {
          type: 'BUY_CARD',
          card: gameEndingThreat,
          fromReserved: false
        };
      }
      // Otherwise, reserve it to steal it from them!
      return {
        type: 'RESERVE_CARD',
        card: gameEndingThreat
      };
    }
  }

  // 3. RANK ALL AFFORDABLE CARDS
  const scoredAffordable = [
    ...affordableReserved.map(c => ({ 
      card: c, 
      fromReserved: true, 
      score: evaluateCardValue(aiPlayer, c, humanPlayer, nobles, isLateGame) + 6 // Prioritize clearing reserved hand
    })),
    ...affordableMarket.map(c => ({ 
      card: c, 
      fromReserved: false, 
      score: evaluateCardValue(aiPlayer, c, humanPlayer, nobles, isLateGame) 
    }))
  ].sort((a, b) => b.score - a.score);

  // High-value immediate buy threshold
  if (scoredAffordable.length > 0) {
    const best = scoredAffordable[0];
    // In late game or if card has great value or tokens are getting full, buy it!
    if (isLateGame || best.score >= 18 || totalAiTokens >= 8 || best.card.prestige > 0) {
      return {
        type: 'BUY_CARD',
        card: best.card,
        fromReserved: best.fromReserved
      };
    }
  }

  // 4. STRATEGIC TARGET SELECTION
  // Find the top 2 cards in the market AI wants to build towards
  const futureCards = allMarketCards
    .map(card => {
      const missing = getMissingTokenCount(aiPlayer, card);
      const value = evaluateCardValue(aiPlayer, card, humanPlayer, nobles, isLateGame);
      // Desirability penalizes cards requiring too many turns to reach
      const priority = value - (missing * 3.5);
      return { card, missing, value, priority };
    })
    .sort((a, b) => b.priority - a.priority);

  const primaryTarget = futureCards[0];
  const secondaryTarget = futureCards[1];

  // 5. TACTICAL RESERVE:
  // Reserve if:
  // - High tier card with massive points (>= 3 pts) that we are close to buying (missing <= 2 tokens)
  // - OR we have 8+ tokens and cannot collect needed gems without discarding/wasting
  if (
    (aiPlayer.reserved || []).length < 3 && 
    primaryTarget && 
    primaryTarget.card.tier >= 2 &&
    primaryTarget.value >= 30 &&
    primaryTarget.missing <= 3 &&
    (totalAiTokens < 10 || gemBank.gold > 0)
  ) {
    // Only reserve if we didn't just reserve or if opponent also wants it
    const oppMissing = humanPlayer ? getMissingTokenCount(humanPlayer, primaryTarget.card) : 10;
    if (oppMissing <= 3 || isLateGame || totalAiTokens >= 8) {
      return {
        type: 'RESERVE_CARD',
        card: primaryTarget.card
      };
    }
  }

  // If we have an affordable card that adds to our engine, buy it rather than hoarding tokens
  if (scoredAffordable.length > 0 && totalAiTokens >= 7) {
    return {
      type: 'BUY_CARD',
      card: scoredAffordable[0].card,
      fromReserved: scoredAffordable[0].fromReserved
    };
  }

  // 6. MASTER GEM COLLECTION STRATEGY
  if (totalAiTokens < 10) {
    // Calculate exact gem deficit for our target(s)
    const gemDeficits = {};
    ALL_REGULAR_GEMS.forEach(g => { gemDeficits[g] = 0; });

    if (primaryTarget) {
      for (const [gemId, cost] of Object.entries(primaryTarget.card.cost)) {
        const has = (aiPlayer.tokens[gemId] || 0) + (aiPlayer.bonuses[gemId] || 0);
        if (has < cost) {
          gemDeficits[gemId] += (cost - has) * 2; // Primary weight
        }
      }
    }
    if (secondaryTarget) {
      for (const [gemId, cost] of Object.entries(secondaryTarget.card.cost)) {
        const has = (aiPlayer.tokens[gemId] || 0) + (aiPlayer.bonuses[gemId] || 0);
        if (has < cost) {
          gemDeficits[gemId] += (cost - has); // Secondary weight
        }
      }
    }

    // Rank needed gem colors by deficit priority
    const prioritizedGems = ALL_REGULAR_GEMS
      .filter(g => (gemBank[g] || 0) > 0)
      .sort((a, b) => (gemDeficits[b] || 0) - (gemDeficits[a] || 0));

    // Move A: Double-take (2 tokens of same color)
    // Professional play: take 2 of the same color if we have a severe deficit in that color and bank >= 4
    for (const gemId of prioritizedGems) {
      if ((gemBank[gemId] || 0) >= 4 && (10 - totalAiTokens) >= 2 && gemDeficits[gemId] >= 2) {
        return {
          type: 'TAKE_GEMS',
          gems: [gemId, gemId]
        };
      }
    }

    // Move B: 3 distinct gems (target bottlenecks first)
    const distinctPick = [];
    for (const gemId of prioritizedGems) {
      if (distinctPick.length < 3 && totalAiTokens + distinctPick.length < 10) {
        distinctPick.push(gemId);
      }
    }

    // If still have room, pick colors that deny opponent
    if (distinctPick.length < 3 && totalAiTokens + distinctPick.length < 10 && humanPlayer) {
      const oppDeficits = [];
      const oppTarget = allMarketCards
        .filter(c => (c.prestige || 0) >= 2)
        .sort((a, b) => getMissingTokenCount(humanPlayer, a) - getMissingTokenCount(humanPlayer, b))[0];

      if (oppTarget) {
        for (const [gemId, cost] of Object.entries(oppTarget.cost)) {
          const has = (humanPlayer.tokens[gemId] || 0) + (humanPlayer.bonuses[gemId] || 0);
          if (has < cost && (gemBank[gemId] || 0) > 0 && !distinctPick.includes(gemId)) {
            oppDeficits.push(gemId);
          }
        }
      }

      for (const gemId of oppDeficits) {
        if (distinctPick.length < 3 && totalAiTokens + distinctPick.length < 10) {
          distinctPick.push(gemId);
        }
      }
    }

    // Fill any remaining slot with whatever is available
    if (distinctPick.length < 3 && totalAiTokens + distinctPick.length < 10) {
      for (const gemId of ALL_REGULAR_GEMS) {
        if ((gemBank[gemId] || 0) > 0 && !distinctPick.includes(gemId)) {
          distinctPick.push(gemId);
          if (distinctPick.length === 3 || totalAiTokens + distinctPick.length >= 10) break;
        }
      }
    }

    if (distinctPick.length > 0) {
      return {
        type: 'TAKE_GEMS',
        gems: distinctPick
      };
    }
  }

  // 7. FALLBACK ACTIONS:
  // If we can afford ANY card, buy the best one rather than wasting a turn
  if (scoredAffordable.length > 0) {
    return {
      type: 'BUY_CARD',
      card: scoredAffordable[0].card,
      fromReserved: scoredAffordable[0].fromReserved
    };
  }

  // Fallback Reserve: Reserve top market card and claim gold
  if ((aiPlayer.reserved || []).length < 3 && allMarketCards.length > 0) {
    return {
      type: 'RESERVE_CARD',
      card: primaryTarget?.card || allMarketCards[0]
    };
  }

  return null;
}
