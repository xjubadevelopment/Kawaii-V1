const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getGuildSettings } = require("../../utils/database");

module.exports = {
  name: 'timeout',
  async execute(message, args) {
    const settings = getGuildSettings(message.guild.id);
    if (settings.timeout_enabled === 0) return message.reply("This command is disabled in this server.");

    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('You do not have permission to timeout members.');
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('Please mention a member to timeout.');

    const duration = parseInt(args[1]);
    if (isNaN(duration)) return message.reply('Please provide a duration in minutes.');

    const reason = args.slice(2).join(' ') || 'No reason provided';
    
    try {
      await target.timeout(duration * 60 * 1000, reason);
      const embed = new EmbedBuilder()
        .setColor('#ffff00')
        .setTitle('Member Timed Out')
        .setDescription(`${target.user.tag} has been timed out for ${duration} minutes.\n**Reason:** ${reason}`)
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      message.reply('I could not timeout this member.');
    }
  },
};