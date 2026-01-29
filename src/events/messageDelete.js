const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { formatUser, formatChannel, createLoggingContainer } = require('../utils/formatters');

module.exports = {
  name: 'messageDelete',
  execute(message) {
    if (!message.guild || !message.author) return;

    const settings = getGuildSettings(message.guild.id);
    if (!settings.message_delete_channel_id) return;

    const logChannel = message.guild.channels.cache.get(settings.message_delete_channel_id);
    if (!logChannel) return;

    let attachmentText = '';
    if (message.attachments.size > 0) {
      attachmentText = '\n**__Attachment__**\n';
      message.attachments.forEach(attachment => {
        attachmentText += `[**\`${attachment.name}\`**](${attachment.url})\n`;
      });
    }

    const content = `**Author:** ${formatUser(message.author)}, **ID:** \`${message.author.id}\`
**Channel:** ${formatChannel(message.channel)} **ID:** \`${message.channel.id}\`
**Server:** \`${message.guild.name}\`
**ID:** \`${message.guild.id}\`
${message.content ? `\n\`\`\`\n${message.content.substring(0, 1024)}\n\`\`\`` : ''}${attachmentText}`;

    const avatarUrl = message.author.displayAvatarURL({ extension: 'png', size: 256 });
    const container = createLoggingContainer('### Message Deleted', content, {
      thumbnailUrl: avatarUrl,
      thumbnailDescription: `${message.author.username}'s Avatar`
    });

    logChannel.send({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    }).catch(console.error);
  }
};

/*
: ! Aegis !
    + Discord: itsfizys
    + Portfolio: https://itsfiizys.com
    + Community: https://discord.gg/8wfT8SfB5Z  (Kawaii Development )
    + for any queries reach out Community or DM me.
*/
