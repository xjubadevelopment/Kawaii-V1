const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getGuildSettings } = require("../../utils/database");

module.exports = {
  name: 'unban',
  async execute(message, args) {
    const settings = getGuildSettings(message.guild.id);
    if (settings.unban_enabled === 0) return message.reply("This command is disabled in this server.");

    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('You do not have permission to unban members.');
    }

    const userId = args[0];
    if (!userId) return message.reply('Please provide a user ID to unban.');

    try {
      await message.guild.members.unban(userId);
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Member Unbanned')
        .setDescription(`User with ID \`${userId}\` has been unbanned.`)
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      message.reply('I could not find a ban for that user ID.');
    }
  },
};