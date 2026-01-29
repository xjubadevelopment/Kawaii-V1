const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { createLoggingContainer } = require('../utils/formatters');

module.exports = {
  name: 'roleCreate',
  execute(role) {
    const settings = getGuildSettings(role.guild.id);
    if (!settings.role_create_channel_id) return;

    const logChannel = role.guild.channels.cache.get(settings.role_create_channel_id);
    if (!logChannel) return;

    const color = role.color > 0 ? `#${role.color.toString(16).padStart(6, '0')}` : 'Default';

    const content = `**Role:** **${role.name}**, **ID:** \`${role.id}\`
**Color:** ${color}
**Hoisted:** ${role.hoist ? 'Yes' : 'No'}
**Server:** \`${role.guild.name}\`
**ID:** \`${role.guild.id}\``;

    const container = createLoggingContainer('### Role Created', content);

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
