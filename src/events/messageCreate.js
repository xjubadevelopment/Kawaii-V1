const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, PermissionFlagsBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { updateGuildSettings, getLevelUser, updateLevelUser } = require('../utils/database');

const commands = new Collection();
const moderatorPath = path.join(__dirname, '../commands/moderator');
const utilityPath = path.join(__dirname, '../commands/utility');
const economyPath = path.join(__dirname, '../commands/economy');
const rankPath = path.join(__dirname, '../commands/rank');
const levelPath = path.join(__dirname, '../commands/level');
const funPath = path.join(__dirname, '../commands/fun');

const loadCommands = (dir) => {
  if (fs.existsSync(dir)) {
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(dir, file);
      const command = require(filePath);
      commands.set(command.name, command);
      if (command.aliases && Array.isArray(command.aliases)) {
        for (const alias of command.aliases) {
          commands.set(alias, command);
        }
      }
    }
  }
};

loadCommands(moderatorPath);
loadCommands(utilityPath);
loadCommands(economyPath);
loadCommands(rankPath);
loadCommands(levelPath);
loadCommands(funPath);

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // Leveling System
    const user = getLevelUser(message.author.id);
    const now = new Date();
    const lastMsg = new Date(user.last_msg_at);

    // 1 minute cooldown for XP gain
    if (now - lastMsg > 60000) {
      const xpGain = Math.floor(Math.random() * 11) + 15; // 15-25 XP
      let newXp = user.xp + xpGain;
      let newLevel = user.level;
      const xpNeeded = newLevel * 1000;

      if (newXp >= xpNeeded) {
        newLevel++;
        message.reply(`🎉 Congratulations **${message.author.username}**, you reached **Level ${newLevel}**!`);
      }

      updateLevelUser(message.author.id, {
        xp: newXp,
        level: newLevel,
        last_msg_at: now.toISOString()
      });
    }

    if (!message.content.startsWith(config.PREFIX)) return;

    const args = message.content.slice(config.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = commands.get(commandName);
    if (command) {
      try {
        return await command.execute(message, args);
      } catch (error) {
        console.error(error);
        return message.reply('There was an error trying to execute that command!');
      }
    }
  },
};