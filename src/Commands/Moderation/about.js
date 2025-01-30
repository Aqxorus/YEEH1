// Shows the bots client + websocket ping
const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  InteractionContextType,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription(`Information about the bot!`)
    .setContexts(InteractionContextType.Guild),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();

    const newEmbed = new EmbedBuilder()
      .setAuthor({
        name: 'YEEH1',
        iconURL: client.user.displayAvatarURL({ size: 1024 }),
      })
      .setTitle('About YEEH1')
      .setColor('White')
      .setDescription(
        `YEEH1 is a multi-purpose discord bot created by <@598624275083034654>.`
      )
      .addFields({
        name: 'Information',
        value: '>>> **Author Website:** [View Website](https://aqxorus.me)',
      });

    await interaction.editReply({
      embeds: [newEmbed],
    });
  },
};
