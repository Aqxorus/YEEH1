const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(`Replies with the API's Latency + Client Ping.`),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const { createdTimestamp } = interaction;

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Aqua')
          .setDescription(
            `API Latency: ${client.ws.ping}ms\nClient Ping: ${
              Date.now() - createdTimestamp
            }ms`
          ),
      ],
      ephemeral: false,
    });
  },
};
