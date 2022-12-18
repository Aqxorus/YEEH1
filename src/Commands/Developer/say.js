const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription(`Says the provided text. (DEV ONLY)`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName('message')
        .setDescription('The message the bot is going to say. (DEV ONLY)')
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const message = interaction.options.getString('message');

    await interaction.deferReply();
    await interaction.deleteReply();
    await interaction.channel.send(message);
  },
};
