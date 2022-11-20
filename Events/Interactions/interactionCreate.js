const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
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

    try {
      command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription(
              'Something went wrong while executing this command...'
            ),
        ],
        ephemeral: true,
      });
    }
  },
};
