const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { createLoggingContainer } = require('../utils/formatters');

module.exports = {
  name: 'roleUpdate',
  execute(oldRole, newRole) {
    const settings = getGuildSettings(newRole.guild.id);
    if (!settings.role_update_channel_id) return;

    const logChannel = newRole.guild.channels.cache.get(settings.role_update_channel_id);
    if (!logChannel) return;

    const changes = [];
    if (oldRole.name !== newRole.name) {
      changes.push(`**Name:** ${oldRole.name} → ${newRole.name}`);
    }
    if (oldRole.color !== newRole.color) {
      const oldColor = oldRole.color > 0 ? `#${oldRole.color.toString(16).padStart(6, '0')}` : 'Default';
      const newColor = newRole.color > 0 ? `#${newRole.color.toString(16).padStart(6, '0')}` : 'Default';
      changes.push(`**Color:** ${oldColor} → ${newColor}`);
    }
    if (oldRole.hoist !== newRole.hoist) {
      changes.push(`**Hoisted:** ${oldRole.hoist} → ${newRole.hoist}`);
    }

    if (changes.length === 0) return;

    const content = `**Role:** **${newRole.name}**, **ID:** \`${newRole.id}\`
${changes.join('\n')}
**Server:** \`${newRole.guild.name}\`
**ID:** \`${newRole.guild.id}\``;

    const container = createLoggingContainer('### Role Updated', content);

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
