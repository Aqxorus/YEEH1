// Gives you a dadjoke
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dadjokes')
    .setDescription('Random dadjokes from icanhazdadjoke.com')
    .setDMPermission(false),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      await interaction.deferReply();

      let response = await fetch(`https://icanhazdadjoke.com/slack`);
      let data = await response.text();
      const img = JSON.parse(data);

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setFooter({ text: `Dad jokes  -  (icanhazdadjoke.com)` })
        .setDescription(img.attachments[0].text);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
    }
  },
};
