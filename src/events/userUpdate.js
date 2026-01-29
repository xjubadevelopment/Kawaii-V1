const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('../utils/database');
const { formatUser, createLoggingContainerWithGallery } = require('../utils/formatters');

module.exports = {
  name: 'userUpdate',
  async execute(oldUser, newUser) {
    const changes = [];
    
    if (oldUser.username !== newUser.username) {
      changes.push(`**Username:** ${oldUser.username} → ${newUser.username}`);
    }
    if (oldUser.globalName !== newUser.globalName) {
      const oldName = oldUser.globalName || 'None';
      const newName = newUser.globalName || 'None';
      changes.push(`**Display Name:** ${oldName} → ${newName}`);
    }
    if (oldUser.avatar !== newUser.avatar) {
      changes.push('**Avatar:** Changed');
    }
    if (oldUser.banner !== newUser.banner) {
      changes.push('**Banner:** Changed');
    }
    if (oldUser.accentColor !== newUser.accentColor) {
      const oldColor = oldUser.accentColor ? `#${oldUser.accentColor.toString(16).padStart(6, '0')}` : 'None';
      const newColor = newUser.accentColor ? `#${newUser.accentColor.toString(16).padStart(6, '0')}` : 'None';
      changes.push(`**Accent Color:** ${oldColor} → ${newColor}`);
    }
    if (oldUser.discriminator !== newUser.discriminator) {
      changes.push(`**Discriminator:** ${oldUser.discriminator} → ${newUser.discriminator}`);
    }

    if (changes.length === 0) return;

    console.log(`[USER UPDATE] ${newUser.tag} - ${changes.length} change(s)`);

    const { client } = require('../index');
    
    for (const guild of client.guilds.cache.values()) {
      try {
        const member = guild.members.cache.get(newUser.id);
        if (!member) continue;

        const settings = getGuildSettings(guild.id);
        if (!settings.user_update_channel_id) continue;

        const logChannel = guild.channels.cache.get(settings.user_update_channel_id);
        if (!logChannel) {
          console.log(`  [ERROR] Channel ${settings.user_update_channel_id} not found in ${guild.name}`);
          continue;
        }

        const content = `**User:** ${formatUser(newUser)}, **ID:** \`${newUser.id}\`
${changes.join('\n')}
**Server:** \`${guild.name}\`
**ID:** \`${guild.id}\``;

        const avatarUrl = newUser.displayAvatarURL({ extension: 'png', size: 1024 });
        const container = createLoggingContainerWithGallery(
          '### User Updated', 
          content, 
          avatarUrl,
          `${newUser.username}'s Avatar`
        );

        await logChannel.send({
          components: [container],
          flags: MessageFlags.IsComponentsV2
        });

        console.log(`  ✓ Logged to ${guild.name} #${logChannel.name}`);
      } catch (error) {
        console.error(`  ✗ Error in ${guild.name}:`, error.message);
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
