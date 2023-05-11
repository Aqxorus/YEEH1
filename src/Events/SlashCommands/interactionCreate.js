'use strict';
const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Client,
} = require('discord.js');
const config = require('../../../config.json');

const cooldowns = new Map();

module.exports = {
  name: 'interactionCreate',
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription('This command is outdated'),
        ],
        ephemeral: true,
      });

    if (command.developer && interaction.user.id !== '598624275083034654')
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription('This command is only available to the developer.'),
        ],
        ephemeral: true,
      });

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Map());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || config.defaultCooldown) * 1000; // Convert to milliseconds

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setDescription(
                `Please wait ${timeLeft.toFixed(
                  1
                )} seconds before using the \`${
                  interaction.commandName
                }\` command again.`
              ),
          ],
          ephemeral: true,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(err);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription(
              'Something went wrong while executing this command'
            ),
        ],
        ephemeral: true,
      });
    }
  },
};
