// Timeout people
const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Client,
} = require('discord.js');
const Database = require('../../Models/Infractions');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription(`Timeouts a user.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('Select the target member.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('duration')
        .setDescription('Provide a duration for this timeout. (1m, 1h, 1d)')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Provide a reason for this timeout.')
        .setMaxLength(512)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, guild, member } = interaction;

    const target = options.getMember('target');
    const duration = options.getString('duration');
    const reason =
      options.getString('reason') + ` | Issued by ${interaction.user.tag}` ||
      'None specified' + ` | Issued by ${interaction.user.tag}`;

    const errorsArray = [];

    const errorsEmbed = new EmbedBuilder()
      .setAuthor({
        name: 'Could not timeout member',
      })
      .setColor('Red');

    if (!target)
      return interaction.reply({
        embeds: [
          errorsEmbed.setDescription('Member has most likely left the server'),
        ],
        ephemeral: true,
      });

    if (!ms(duration) || ms(duration) > ms('28d'))
      errorsArray.push(
        'Because time provided is invalid or over the 28d limit.'
      );

    if (!target.manageable || !target.moderatable)
      errorsArray.push('Because the the target is not bannable');

    if (member.roles.highest.position < target.roles.highest.position)
      errorsArray.push(
        'Because selected member has a higher role position than you.'
      );

    if (errorsArray.length)
      return interaction.reply({
        embeds: [errorsEmbed.setDescription(errorsArray.join('\n'))],
        ephemeral: true,
      });

    let timeError = false;
    await target.timeout(ms(duration), reason).catch(() => (timeError = true));

    if (timeError)
      return interaction.reply({
        embeds: [
          errorsEmbed.setDescription(
            'Could not timeout user due to an uncommon error. Cannot take negative values'
          ),
        ],
        ephemeral: false,
      });

    const newInfractionsObject = {
      issuerId: member.id,
      issuerTag: member.user.tag,
      targetId: target.id,
      targetTag: target.user.tag,
      reason: reason,
      date: Date.now(),
      type: 'Timeout',
    };

    let userData = await Database.findOne({
      guildId: guild.id,
      userId: target.id,
    });
    if (!userData)
      userData = await Database.create({
        guildId: guild.id,
        userId: target.id,
        infractions: [newInfractionsObject],
      });
    else
      userData.infractions.push(newInfractionsObject) &&
        (await userData.save());

    const successEmbed = new EmbedBuilder()
      .setAuthor({
        name: 'Timeout issues',
        iconURL: guild.iconURL(),
      })
      .setColor('Gold')
      .setDescription(
        [
          `${target} was issued a timeout for ${ms(ms(duration), {
            long: true,
          })}** by ${member}`,
          `bringing their infractions to ${userData.infractions.length} points**.`,
          `\nReason: ${reason}`,
        ].join('\n')
      );

    return interaction.reply({
      embeds: [successEmbed],
    });
  },
};
