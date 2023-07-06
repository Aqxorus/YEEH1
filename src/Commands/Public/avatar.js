// Shows the user's avatar
const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription(`Shows a user's avatar`)
    .setDMPermission(false)
    .addUserOption(option =>
      option.setName('input').setDescription('Select the user')
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    const target = interaction.options.getMember('input') || interaction.member;
    const { user } = target;

    const newEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${user.tag}`,
        iconURL: target.displayAvatarURL(),
      })
      .setTitle(`User Avatar`)
      .setImage(user.displayAvatarURL({ size: 4096 }))
      .setTimestamp();

    await interaction.reply({
      embeds: [newEmbed],
    });
  },
};
