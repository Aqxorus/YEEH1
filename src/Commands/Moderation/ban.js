// Ban people
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
    .setName('ban')
    .setDescription(`Bans a user.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) =>
      option
        .setName('input')
        .setDescription('Select the target member.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
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

    const target = options.getMember('input');
    const reason = options.getString('reason') || `None specified`;

    const errorsArray = [];

    const errorsEmbed = new EmbedBuilder()
      .setAuthor({
        name: 'Could not ban member',
      })
      .setColor('Red');

    if (!target)
      return interaction.reply({
        embeds: [
          errorsEmbed.setDescription(
            'Because member has most likely left the server'
          ),
        ],
        flags: MessageFlags.Ephemeral,
      });

    if (!target.manageable || !target.moderatable)
      errorsArray.push('Because the the target is not bannable');

    if (member.roles.highest.position < target.roles.highest.position)
      errorsArray.push(
        'Because selected member has a higher role position than you.'
      );

    if (errorsArray.length)
      return interaction.reply({
        embeds: [errorsEmbed.setDescription(errorsArray.join('\n'))],
        flags: MessageFlags.Ephemeral,
      });

    const successEmbed = new EmbedBuilder()
      .setAuthor({
        name: 'Ban issues',
        iconURL: guild.iconURL(),
      })
      .setColor('Gold')
      .setDescription(
        [`${target} was issued a ban by ${member}`, `\nReason: ${reason}`].join(
          '\n'
        )
      )
      .setFooter({
        text: 'Ban',
      })
      .setTimestamp();

    await target
      .ban({
        reason: `${reason}, Issued by ${interaction.user.tag}`,
      })
      .catch(console.error),
      interaction.reply({
        embeds: [successEmbed],
      });
  },
};
