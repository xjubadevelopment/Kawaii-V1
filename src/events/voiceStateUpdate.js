const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { formatUser, formatChannel, createLoggingContainer } = require('../utils/formatters');

module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState) {
    const settings = getGuildSettings(newState.guild.id);
    if (!settings.voice_change_channel_id) return;

    const channel = newState.guild.channels.cache.get(settings.voice_change_channel_id);
    if (!channel) return;

    let title, description;

    if (!oldState.channel && newState.channel) {
      title = '### Voice Joined';
      description = `${formatChannel(newState.channel)}`;
    } else if (oldState.channel && !newState.channel) {
      title = '### Voice Left';
      description = `${formatChannel(oldState.channel)}`;
    } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
      title = '### Voice Moved';
      description = `${formatChannel(oldState.channel)} → ${formatChannel(newState.channel)}`;
    }

    if (!title) return;

    const content = `**User:** ${formatUser(newState.member.user)}, **ID:** \`${newState.member.user.id}\`
**Channel:** ${description}
**Server:** \`${newState.guild.name}\`
**ID:** \`${newState.guild.id}\``;

    const avatarUrl = newState.member.user.displayAvatarURL({ extension: 'png', size: 256 });
    const container = createLoggingContainer(title, content, {
      thumbnailUrl: avatarUrl,
      thumbnailDescription: `${newState.member.user.username}'s Avatar`
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
