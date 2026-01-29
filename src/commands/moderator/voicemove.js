const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getGuildSettings } = require("../../utils/database");

module.exports = {
  name: 'voicemove',
  async execute(message, args) {
    const settings = getGuildSettings(message.guild.id);
    if (settings.voicemove_enabled === 0) return message.reply("This command is disabled in this server.");

    if (!message.member.permissions.has(PermissionFlagsBits.MoveMembers)) {
      return message.reply('You do not have permission to move members.');
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('Please mention a member to move.');

    const channelId = args[1]?.replace(/[<#>]/g, '');
    const channel = message.guild.channels.cache.get(channelId);
    if (!channel || channel.type !== 2) return message.reply('Please provide a valid voice channel ID or mention.');

    if (!target.voice.channel) return message.reply('That member is not in a voice channel.');

    await target.voice.setChannel(channel);
    const embed = new EmbedBuilder()
      .setColor('#add8e6')
      .setTitle('Voice Moved')
      .setDescription(`${target.user.tag} has been moved to ${channel.name}.`)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};