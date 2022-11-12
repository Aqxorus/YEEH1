const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(`Replies with the API's Latency + Client Ping.`),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    interaction.reply({
      content: `API Latency: ${client.ws.ping}ms\nClient Ping: ${
        Date.now() - interaction.createdTimestamp
      }ms`,
      ephemeral: false,
    });
  },
};
