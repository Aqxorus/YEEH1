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
  async execute(interaction, client) {
    const target = interaction.options.getMember('user') || interaction.member;
    const { user } = target;

    const statusType = {
      idle: '1FJj7pX.png',
      dnd: 'fbLqSYv.png',
      online: 'JhW7v9d.png',
      invisible: 'dibKqth.png',
    };

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: user.tag,
          })
          .setImage(user.avatarURL({ size: 1024 })),
      ],
      ephemeral: false,
    });
  },
};
