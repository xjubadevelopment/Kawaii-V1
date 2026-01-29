const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { createLoggingContainer } = require('../utils/formatters');

module.exports = {
  name: 'inviteDelete',
  execute(invite) {
    if (!invite.guild) return;

    const settings = getGuildSettings(invite.guild.id);
    if (!settings.invite_delete_channel_id) return;

    const logChannel = invite.guild.channels.cache.get(settings.invite_delete_channel_id);
    if (!logChannel) return;

    const content = `**Channel:** <#${invite.channel.id}>, **ID:** \`${invite.channel.id}\`
**Code:** ${invite.code}
**Server:** \`${invite.guild.name}\`
**ID:** \`${invite.guild.id}\``;

    const container = createLoggingContainer('### Invite Deleted', content);

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
