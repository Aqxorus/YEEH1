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
    .setName('ping')
    .setDescription(`Replies with the API's Latency + Client Ping.`)
    .setContexts(InteractionContextType.Guild),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    const newEmbed = new EmbedBuilder()
      .setColor('Blue')
      .setDescription(
        `API Latency: ${client.ws.ping}ms\nClient Ping: ${ping}ms`
      );

    await interaction.editReply({
      embeds: [newEmbed],
    });
  },
};
