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
    .setDMPermission(false),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    client.emit('guildMemberAdd', interaction.member);

    interaction.reply({
      content: 'Emitted guildMemberAdd',
      ephemeral: true,
    });
  },
};
