// Unban people
const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Client,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription(`Unbans a user.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName('user_id')
        .setDescription('The ID of the user you want to unban')
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName('reason')
        .setDescription('Provide a reason for this ban.')
        .setMaxLength(512)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guild, member } = interaction;

    const target = options.getString('user_id');
    const reason = options.getString('reason') || 'None specified';
    let error;

    if (isNaN(target))
      return interaction.reply({
        content: `A user ID must only have numbers`,
        ephemeral: true,
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
        ephemeral: true,
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
              `**Reason:** ${reason}, Issued by ${member.user.tag}`,
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
