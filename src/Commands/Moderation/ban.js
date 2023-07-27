// Ban people
const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Client,
} = require('discord.js');
const Database = require('../../Models/Infractions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription(`Bans a user.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption(option =>
      option
        .setName('input')
        .setDescription('Select the target member.')
        .setRequired(true)
    )
    .addStringOption(option =>
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
        ephemeral: true,
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
        ephemeral: true,
      });

    const newInfractionsObject = {
      issuerId: member.id,
      issuerTag: member.user.tag,
      targetId: target.id,
      targetTag: target.user.tag,
      reason: reason,
      date: Date.now(),
      type: 'Ban',
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
        name: 'Ban issues',
        iconURL: guild.iconURL(),
      })
      .setColor('Gold')
      .setDescription(
        [
          `${target} was issued a ban **by ${member}`,
          `bringing their infractions to ${userData.infractions.length} points**.`,
          `\nReason: ${reason}`,
        ].join('\n')
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
