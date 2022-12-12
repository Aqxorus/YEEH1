const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require('discord.js')
import('node-fetch')

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('dadjokes')
    .setDescription('Random dadjokes from icanhazdadjoke.com'),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      let response = await fetch(`https://icanhazdadjoke.com/slack`)
      let data = await response.text()
      const img = JSON.parse(data)
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setFooter({ text: `Dad jokes  -  (icanhazdadjoke.com)` })
        .setDescription(img.attachments[0].text)
      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.log(error)
    }
  },
}
