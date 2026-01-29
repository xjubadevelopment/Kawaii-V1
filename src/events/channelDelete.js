const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { createLoggingContainer } = require('../utils/formatters');

module.exports = {
  name: 'channelDelete',
  execute(channel) {
    if (!channel.guild) return;

    const settings = getGuildSettings(channel.guild.id);
    if (!settings.channel_delete_channel_id) return;

    const logChannel = channel.guild.channels.cache.get(settings.channel_delete_channel_id);
    if (!logChannel) return;

    const content = `**Channel:** #${channel.name}, **ID:** \`${channel.id}\`
**Type:** ${channel.type}
**Server:** \`${channel.guild.name}\`
**ID:** \`${channel.guild.id}\``;

    const container = createLoggingContainer('### Channel Deleted', content);

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
