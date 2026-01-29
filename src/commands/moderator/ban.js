const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getGuildSettings } = require("../../utils/database");

module.exports = {
  name: 'ban',
  async execute(message, args) {
    const settings = getGuildSettings(message.guild.id);
    if (settings.ban_enabled === 0) return message.reply("This command is disabled in this server.");

    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('You do not have permission to ban members.');
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('Please mention a member to ban.');

    if (!target.bannable) return message.reply('I cannot ban this member.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await target.ban({ reason });

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Member Banned')
      .setDescription(`${target.user.tag} has been banned.\n**Reason:** ${reason}`)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};