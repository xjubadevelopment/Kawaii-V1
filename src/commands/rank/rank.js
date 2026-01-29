const { EmbedBuilder } = require('discord.js');
const { getEconomyUser, db } = require('../../utils/database');

module.exports = {
  name: 'rank',
  aliases: ['level', 'lb', 'leaderboard'],
  async execute(message, args) {
    const topUsers = db.prepare('SELECT user_id, (balance + bank) as total_money FROM economy_users ORDER BY total_money DESC LIMIT 10').all();
    
    if (topUsers.length === 0) {
      return message.reply('The leaderboard is currently empty!');
    }

    let description = '';
    for (let i = 0; i < topUsers.length; i++) {
      const user = topUsers[i];
      try {
        const discordUser = await message.client.users.fetch(user.user_id);
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        description += `${medal} **${discordUser.username}** — $${user.total_money.toLocaleString()}\n`;
      } catch {
        description += `${i + 1}. **Unknown User** — $${user.total_money.toLocaleString()}\n`;
      }
    }

    const embed = new EmbedBuilder()
      .setColor('#ffd700')
      .setTitle('🏆 Economy Leaderboard')
      .setDescription(description)
      .setTimestamp()
      .setFooter({ text: 'Top 10 richest players' });

    message.reply({ embeds: [embed] });
  }
};
