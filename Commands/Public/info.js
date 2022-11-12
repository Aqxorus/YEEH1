const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription(`Info about the bot`),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    interaction.reply({
      content: 'Made by <@598624275083034654>. Completion ETA: ~ 3 months',
      ephemeral: false,
    });
  },
};
