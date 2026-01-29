const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { createLoggingContainer } = require('../utils/formatters');

module.exports = {
  name: 'channelUpdate',
  execute(oldChannel, newChannel) {
    if (!newChannel.guild) return;

    const settings = getGuildSettings(newChannel.guild.id);
    if (!settings.channel_update_channel_id) return;

    const logChannel = newChannel.guild.channels.cache.get(settings.channel_update_channel_id);
    if (!logChannel) return;

    const changes = [];
    if (oldChannel.name !== newChannel.name) {
      changes.push(`**Name:** ${oldChannel.name} → ${newChannel.name}`);
    }
    if (oldChannel.topic !== newChannel.topic) {
      changes.push(`**Topic:** ${oldChannel.topic || 'None'} → ${newChannel.topic || 'None'}`);
    }
    if (oldChannel.nsfw !== newChannel.nsfw) {
      changes.push(`**NSFW:** ${oldChannel.nsfw} → ${newChannel.nsfw}`);
    }

    if (changes.length === 0) return;

    const content = `**Channel:** <#${newChannel.id}>, **ID:** \`${newChannel.id}\`
${changes.join('\n')}
**Server:** \`${newChannel.guild.name}\`
**ID:** \`${newChannel.guild.id}\``;

    const container = createLoggingContainer('### Channel Updated', content);

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
