const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getGuildSettings } = require("../../utils/database");

module.exports = {
  name: 'kick',
  async execute(message, args) {
    const settings = getGuildSettings(message.guild.id);
    if (settings.kick_enabled === 0) return message.reply("This command is disabled in this server.");

    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply('You do not have permission to kick members.');
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('Please mention a member to kick.');

    if (!target.kickable) return message.reply('I cannot kick this member.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await target.kick(reason);

    const embed = new EmbedBuilder()
      .setColor('#ffa500')
      .setTitle('Member Kicked')
      .setDescription(`${target.user.tag} has been kicked.\n**Reason:** ${reason}`)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};