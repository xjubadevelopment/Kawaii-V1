const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { createLoggingContainer } = require('../utils/formatters');

module.exports = {
  name: 'guildUpdate',
  execute(oldGuild, newGuild) {
    const settings = getGuildSettings(newGuild.id);
    if (!settings.server_update_channel_id) return;

    const logChannel = newGuild.channels.cache.get(settings.server_update_channel_id);
    if (!logChannel) return;

    const changes = [];
    if (oldGuild.name !== newGuild.name) {
      changes.push(`**Name:** ${oldGuild.name} → ${newGuild.name}`);
    }
    if (oldGuild.icon !== newGuild.icon) {
      changes.push('**Icon:** Changed');
    }
    if (oldGuild.description !== newGuild.description) {
      changes.push('**Description:** Changed');
    }
    if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
      changes.push(`**Verification:** ${oldGuild.verificationLevel} → ${newGuild.verificationLevel}`);
    }

    if (changes.length === 0) return;

    const content = `**Server:** \`${newGuild.name}\`, **ID:** \`${newGuild.id}\`
${changes.join('\n')}`;

    const container = createLoggingContainer('### Server Updated', content);

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
