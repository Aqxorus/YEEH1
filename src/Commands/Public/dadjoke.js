const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require('discord.js');
const axios = require('axios');

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName('dadjokes')
    .setDescription('Random dad jokes from icanhazdadjoke.com')
    .setDMPermission(false),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      await interaction.deferReply();

      const response = await axios.get('https://icanhazdadjoke.com/slack');
      const joke = response.data.attachments[0].text;

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setFooter({ text: 'Dad jokes - icanhazdadjoke.com' })
        .setDescription(joke);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
    }
  },
};
