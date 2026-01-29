const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getGuildSettings } = require("../../utils/database");

module.exports = {
  name: 'voiceunmute',
  async execute(message, args) {
    const settings = getGuildSettings(message.guild.id);
    if (settings.voiceunmute_enabled === 0) return message.reply("This command is disabled in this server.");

    if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return message.reply('You do not have permission to voice unmute members.');
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('Please mention a member to voice unmute.');

    if (!target.voice.channel) return message.reply('That member is not in a voice channel.');

    await target.voice.setMute(false);
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('Voice Unmuted')
      .setDescription(`${target.user.tag} has been server voice unmuted.`)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};