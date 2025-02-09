// Unban people
const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Client,
  InteractionContextType,
  MessageFlags,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription(`Unbans a user.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('The ID of the user you want to unban')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Provide a reason for this unban.')
        .setMaxLength(512)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guild, member } = interaction;

    const target = options.getString('input');
    const reason = options.getString('reason') || 'None specified';
    let error;

    if (isNaN(target))
      return interaction.reply({
        content: `A user ID must only have numbers`,
        flags: MessageFlags.Ephemeral,
      });

    const fetchTargetBan = await guild.bans.fetch(target).catch(() => {
      error = true;
    });

    await guild.bans
      .remove(target, {
        reason: `${reason}, Issued by ${member.user.tag}`,
      })
      .catch(() => {
        error = true;
      });

    if (error)
      return interaction.reply({
        content: `${target} was not found in the ban list`,
        flags: MessageFlags.Ephemeral,
      });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Green')
          .setAuthor({
            name: `${member.user.tag}`,
            iconURL: member.user.displayAvatarURL(),
          })
          .addFields({
            name: 'Info',
            value: [
              `**Member:** ${fetchTargetBan.user.tag} *(${fetchTargetBan.user.id})*`,
              `**Reason:** ${reason} | Issued by ${member.user.tag}`,
            ].join('\n'),
            inline: true,
          })
          .setFooter({
            text: 'Unban',
          })
          .setTimestamp(),
      ],
    });
  },
};
