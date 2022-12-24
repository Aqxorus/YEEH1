// This command is purely for testing the memberlogging system.
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
  ChatInputCommandInteraction,
} = require('discord.js');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('emit')
    .setDescription('Emit the guildMemberAdd/Remove events.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand((options) =>
      options
        .setName('guild_member_add')
        .setDescription('emit guildMemberAdd event')
    )
    .addSubcommand((options) =>
      options
        .setName('guild_member_remove')
        .setDescription('emit guildMemberRemove event')
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case 'guild_member_add':
        client.emit('guildMemberAdd', interaction.member);
        await interaction.reply({
          content: 'Emitted the guildMemberAdd event',
          ephemeral: true,
        });
        break;

      case 'guild_member_remove':
        client.emit('guildMemberRemove', interaction.member);
        await interaction.reply({
          content: 'Emitted the guildMemberRemove event',
          ephemeral: true,
        });
        break;
    }
  },
};
