const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { formatUser, formatRole, createLoggingContainer } = require('../utils/formatters');

module.exports = {
  name: 'guildMemberUpdate',
  execute(oldMember, newMember) {
    const settings = getGuildSettings(newMember.guild.id);

    if (oldMember.nickname !== newMember.nickname && settings.nickname_change_channel_id) {
      const channel = newMember.guild.channels.cache.get(settings.nickname_change_channel_id);
      if (channel) {
        const content = `**User:** ${formatUser(newMember.user)}, **ID:** \`${newMember.user.id}\`
**Old:** ${oldMember.nickname || 'None'}
**New:** ${newMember.nickname || 'None'}
**Server:** \`${newMember.guild.name}\`
**ID:** \`${newMember.guild.id}\``;

        const avatarUrl = newMember.user.displayAvatarURL({ extension: 'png', size: 256 });
        const container = createLoggingContainer('### Nickname Changed', content, {
          thumbnailUrl: avatarUrl,
          thumbnailDescription: `${newMember.user.username}'s Avatar`
        });

        channel.send({
          components: [container],
          flags: MessageFlags.IsComponentsV2
        }).catch(console.error);
      }
    }

    const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
    const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

    if ((addedRoles.size > 0 || removedRoles.size > 0) && settings.role_update_channel_id) {
      const channel = newMember.guild.channels.cache.get(settings.role_update_channel_id);
      if (channel) {
        let contentLines = [`**User:** ${formatUser(newMember.user)}, **ID:** \`${newMember.user.id}\``];
        
        if (addedRoles.size > 0) {
          contentLines.push(`**Added Roles:** ${addedRoles.map(r => formatRole(r)).join(', ')}`);
        }
        if (removedRoles.size > 0) {
          contentLines.push(`**Removed Roles:** ${removedRoles.map(r => formatRole(r)).join(', ')}`);
        }

        contentLines.push(`**Server:** \`${newMember.guild.name}\``);
        contentLines.push(`**ID:** \`${newMember.guild.id}\``);

        const avatarUrl = newMember.user.displayAvatarURL({ extension: 'png', size: 256 });
        const container = createLoggingContainer('### Roles Updated', contentLines.join('\n'), {
          thumbnailUrl: avatarUrl,
          thumbnailDescription: `${newMember.user.username}'s Avatar`
        });

        channel.send({
          components: [container],
          flags: MessageFlags.IsComponentsV2
        }).catch(console.error);
      }
    }
  }
};

/*
: ! Aegis !
    + Discord: itsfizys
    + Portfolio: https://itsfiizys.com
    + Community: https://discord.gg/8wfT8SfB5Z  (Kawaii Development )
    + for any queries reach out Community or DM me.
*/
