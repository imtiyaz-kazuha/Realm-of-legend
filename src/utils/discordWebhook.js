// Sends match results and game stats directly to a Discord Channel via Webhook
export async function sendDiscordMatchWebhook(webhookUrl, matchData) {
  if (!webhookUrl || !webhookUrl.trim().startsWith('https://discord.com/api/webhooks/')) {
    console.log('No valid Discord Webhook URL provided. Skipping notification.');
    return;
  }

  const { winner, loser, winnerScore, loserScore, roomName, turnsCount } = matchData;

  const embed = {
    title: '⚔️ Realm of Legends: Match Concluded! 🏆',
    description: `A battle of champions has ended in **${roomName ? `#${roomName}` : 'Local Match'}**!`,
    color: 0xf59e0b, // Amber Gold
    thumbnail: {
      url: 'https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png' // Satoru Gojo
    },
    fields: [
      {
        name: '👑 Champion / Winner',
        value: `**${winner}** (${winnerScore} Prestige Points)`,
        inline: true
      },
      {
        name: '💀 Defeated Duelist',
        value: `**${loser}** (${loserScore} Prestige Points)`,
        inline: true
      },
      {
        name: '📜 Match Details',
        value: `Room: \`${roomName || 'Local Pass & Play'}\`\nVictory Condition: \`Reached 15 Prestige\``,
        inline: false
      }
    ],
    footer: {
      text: 'Realm of Legends • Anime Strategy Boardgame',
      icon_url: 'https://s4.anilist.co/file/anilistcdn/character/large/b40-MNypXsxSRb1R.png'
    },
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Realm of Legends Arbiter',
        avatar_url: 'https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png',
        embeds: [embed]
      })
    });

    if (res.ok) {
      console.log('Successfully dispatched match result to Discord Webhook!');
    } else {
      console.warn('Discord Webhook returned status:', res.status);
    }
  } catch (err) {
    console.error('Failed to dispatch Discord Webhook:', err);
  }
}
