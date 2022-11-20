const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription(`Info about the bot`),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setDescription('Created by <@598624275083034654>'),
      ],
      ephemeral: false,
    });
  },
};
