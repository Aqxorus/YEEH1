// Displays the infractions of the stated target
const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const DataBase = require('../../Models/Infractions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('infractions')
    .setDescription('Shows the infractions of any member.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName('input')
        .setDescription('Select the member you would like to check.')
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options, guild, member } = interaction;

    const target = options.getMember('input');

    const Infractions2 = new EmbedBuilder()
      .setAuthor({
        name: `Infractions`,
        iconURL: guild.iconURL(),
      })
      .setColor('Random')
      .setDescription(
        [`Member: ${target}`, `Total Infraction Points: **0**`].join('\n')
      )
      .setFooter({
        iconURL: guild.iconURL(),
        text: `YEEH1 | ${interaction.user.tag}`,
      });

    let userData = await DataBase.findOne({
      guildId: guild.id,
      userId: target.id,
    });

    if (userData) {
      const Infractions1 = new EmbedBuilder()
        .setAuthor({
          name: `Infractions`,
          iconURL: guild.iconURL(),
        })
        .setColor('Random')
        .setDescription(
          [
            `Member: ${target}`,
            `Total Infraction Points: **${userData.infractions.length}**`,
          ].join('\n')
        )
        .setFooter({
          text: `YEEH1 | ${interaction.user.tag}`,
        });

      return interaction.reply({ embeds: [Infractions1] });
    } else interaction.reply({ embeds: [Infractions2] });
  },
};
