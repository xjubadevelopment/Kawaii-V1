const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { formatUser, createLoggingContainer } = require('../utils/formatters');

module.exports = {
  name: 'guildBanRemove',
  execute(ban) {
    const settings = getGuildSettings(ban.guild.id);
    if (!settings.ban_channel_id) return;

    const channel = ban.guild.channels.cache.get(settings.ban_channel_id);
    if (!channel) return;

    const content = `**User:** ${formatUser(ban.user)}, **ID:** \`${ban.user.id}\`
**Server:** \`${ban.guild.name}\`
**ID:** \`${ban.guild.id}\``;

    const avatarUrl = ban.user.displayAvatarURL({ extension: 'png', size: 256 });
    const container = createLoggingContainer('### Member Unbanned', content, {
      thumbnailUrl: avatarUrl,
      thumbnailDescription: `${ban.user.username}'s Avatar`,
      accentColor: 0x57F287
    });

    channel.send({
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
