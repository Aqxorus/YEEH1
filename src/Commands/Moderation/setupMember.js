// Setups the member logging system for your server.
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
  Client,
} = require('discord.js');
const Database = require('../../Models/memberLog');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('setup_memberlog')
    .setDescription('Configure the member logging system for your server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addChannelOption((option) =>
      option
        .setName('log_channel')
        .setDescription('Select the logging channel for this system')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName('member_role')
        .setDescription('Set the role to be automatically added')
    )
    .addRoleOption((option) =>
      option
        .setName('bot_role')
        .setDescription('Set the role to automatically added to new bots.')
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;

    const serverName = guild.name;

    const logChannel = options.getChannel('log_channel').id;

    let memberRole = options.getRole('member_role')
      ? options.getRole('member_role').id
      : null;

    let botRole = options.getRole('bot_role')
      ? options.getRole('bot_role').id
      : null;

    await Database.findOneAndUpdate(
      {
        Guild: guild.id,
        guildName: serverName,
      },
      {
        logChannel: logChannel,
        memberRole: memberRole,
        botRole: botRole,
      },
      {
        new: true,
        upsert: true,
      }
    );

    client.guildConfig.set(guild.id, {
      logChannel: logChannel,
      memberRole: memberRole,
      botRole: botRole,
    });

    const Embed = new EmbedBuilder()
      .setColor('Green')
      .setDescription(
        [
          `- Logging Channel Updated: <#${logChannel}>`,
          `- Member Auto-Role Updated: ${
            memberRole ? `<@&${memberRole}>` : 'None specified'
          }`,
          `- Bot Auto-Role Updated: ${
            botRole ? `<@&${botRole}>` : 'None specified'
          }`,
        ].join('\n')
      );

    return interaction.reply({
      embeds: [Embed],
    });
  },
};
