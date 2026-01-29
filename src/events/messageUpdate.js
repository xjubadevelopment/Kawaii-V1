const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { formatUser, formatChannel, createLoggingContainer } = require('../utils/formatters');

module.exports = {
  name: 'messageUpdate',
  execute(oldMessage, newMessage) {
    if (!newMessage.guild || !newMessage.author || oldMessage.content === newMessage.content) return;

    const settings = getGuildSettings(newMessage.guild.id);
    if (!settings.message_edit_channel_id) return;

    const logChannel = newMessage.guild.channels.cache.get(settings.message_edit_channel_id);
    if (!logChannel) return;

    const oldContent = (oldMessage.content || '(No text content)').substring(0, 512);
    const newContent = (newMessage.content || '(No text content)').substring(0, 512);

    let attachmentText = '';
    if (newMessage.attachments.size > 0) {
      attachmentText = '\n**__Attachment__**\n';
      newMessage.attachments.forEach(attachment => {
        attachmentText += `[**\`${attachment.name}\`**](${attachment.url})\n`;
      });
    }

    const content = `**Author:** ${formatUser(newMessage.author)}, **ID:** \`${newMessage.author.id}\`
**Channel:** ${formatChannel(newMessage.channel)} **ID:** \`${newMessage.channel.id}\`
**Server:** \`${newMessage.guild.name}\`
**ID:** \`${newMessage.guild.id}\`
**Old Content:**
\`\`\`
${oldContent}
\`\`\`
**New Content:**
\`\`\`
${newContent}
\`\`\`${attachmentText}`;

    const avatarUrl = newMessage.author.displayAvatarURL({ extension: 'png', size: 256 });
    const container = createLoggingContainer('### Message Edited', content, {
      thumbnailUrl: avatarUrl,
      thumbnailDescription: `${newMessage.author.username}'s Avatar`
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
