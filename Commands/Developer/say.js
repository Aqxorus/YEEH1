const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
} = require('discord.js');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription(`Says the provided text.`)
    .addStringOption((options) =>
      options
        .setName('message')
        .setDescription('The message the bot is going to say.')
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options } = interaction;

    const message = options.getString('message');

    if (!message)
      return interaction.reply({
        content: 'Please add a message.',
        ephemeral: true,
      });
    else {
      interaction.reply({
        content: `${message}`,
      });
    }
  },
};
