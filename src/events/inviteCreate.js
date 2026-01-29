const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { formatUser, createLoggingContainer } = require('../utils/formatters');

module.exports = {
  name: 'inviteCreate',
  execute(invite) {
    if (!invite.guild) return;

    const settings = getGuildSettings(invite.guild.id);
    if (!settings.invite_create_channel_id) return;

    const logChannel = invite.guild.channels.cache.get(settings.invite_create_channel_id);
    if (!logChannel) return;

    const createdBy = invite.inviter ? formatUser(invite.inviter) : 'Unknown';
    const expires = invite.expiresTimestamp ? `<t:${Math.floor(invite.expiresTimestamp / 1000)}:F>` : 'Never';
    const maxUses = invite.maxUses > 0 ? invite.maxUses : 'Unlimited';

    const content = `**Channel:** <#${invite.channel.id}>, **ID:** \`${invite.channel.id}\`
**Code:** ${invite.code}
**Created By:** ${createdBy}
**Max Uses:** ${maxUses}
**Expires:** ${expires}
**Server:** \`${invite.guild.name}\`
**ID:** \`${invite.guild.id}\``;

    const options = {};
    if (invite.inviter) {
      options.thumbnailUrl = invite.inviter.displayAvatarURL({ extension: 'png', size: 256 });
      options.thumbnailDescription = `${invite.inviter.username}'s Avatar`;
    }

    const container = createLoggingContainer('### Invite Created', content, options);

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
