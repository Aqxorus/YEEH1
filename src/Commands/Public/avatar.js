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
    .addUserOption((options) =>
      options.setName('user').setDescription('Select the user')
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    const target = interaction.options.getMember('user') || interaction.member;
    const { user } = target;

    const newEmbed = new EmbedBuilder()
      .setAuthor({ name: `${user.tag}` })
      .setTitle(`User Avatar`)
      .setImage(user.displayAvatarURL({ size: 512 }))
      .setTimestamp();

    await interaction.reply({
      embeds: [newEmbed],
    });
  },
};
