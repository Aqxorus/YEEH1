// Setups the member logging system for your server.
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
  Client,
  InteractionContextType,
} = require('discord.js');
const Database = require('../../Models/memberLog');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('clear_memberlog')
    .setDescription('Clear the member logging system for your server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts(InteractionContextType.Guild),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild } = interaction;

    await Database.findOneAndDelete({
      Guild: guild.id,
    });

    client.guildConfig.delete(guild.id);

    const Embed = new EmbedBuilder()
      .setColor('Red')
      .setDescription(
        [
          `- Logging Channel Updated: None`,
          `- Member Auto-Role Updated: None`,
          `- Bot Auto-Role Updated: None`,
        ].join('\n')
      );

    return interaction.reply({
      embeds: [Embed],
    });
  },
};
