const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { formatUser, createLoggingContainer } = require('../utils/formatters');

module.exports = {
  name: 'guildMemberRemove',
  execute(member) {
    const settings = getGuildSettings(member.guild.id);
    if (!settings.leave_channel_id) return;

    const channel = member.guild.channels.cache.get(settings.leave_channel_id);
    if (!channel) return;

    const content = `**User:** ${formatUser(member.user)}, **ID:** \`${member.user.id}\`
**Server:** \`${member.guild.name}\`
**ID:** \`${member.guild.id}\``;

    const avatarUrl = member.user.displayAvatarURL({ extension: 'png', size: 256 });
    const container = createLoggingContainer('### Member Left', content, {
      thumbnailUrl: avatarUrl,
      thumbnailDescription: `${member.user.username}'s Avatar`
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
