// Kick people
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
    .setName('kick')
    .setDescription(`Kicks a user.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption((options) =>
      options
        .setName('input')
        .setDescription('Select the target member.')
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName('reason')
        .setDescription('Provide a reason for this kick.')
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
        name: 'Could not kick member',
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
      type: 'Kick',
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
        name: ' issues',
        iconURL: guild.iconURL(),
      })
      .setColor('Gold')
      .setDescription(
        [
          `${target} was issued a kick **by ${member}`,
          `bringing their infractions to ${userData.infractions.length} points**.`,
          `\nReason: ${reason}`,
        ].join('\n')
      );

    await target
      .kick(`${reason}, Issued by ${interaction.user.tag}`)
      .catch(console.error),
      interaction.reply({
        embeds: [successEmbed],
      });
  },
};
