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
    const { options, guild } = interaction;

    const target = options.getMember('input');

    const userData = await DataBase.findOne({
      guildId: guild.id,
      userId: target.id,
    });

    if (!userData) {
      const noInfractionsEmbed = new EmbedBuilder()
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

      return interaction.reply({ embeds: [noInfractionsEmbed] });
    }

    const infractionsEmbed = new EmbedBuilder()
      .setAuthor({
        name: `Infractions`,
        iconURL: guild.iconURL(),
      })
      .setColor('Red')
      .setDescription(
        [
          `Member: ${target}`,
          `Total Infraction Points: **${userData.infractions.length}**`,
          `---`,
        ].join('\n')
      )
      .setFooter({
        iconURL: guild.iconURL(),
        text: `YEEH1 | ${interaction.user.tag}`,
      });

    userData.infractions.sort((a, b) => b.time - a.time);

    const fields = [];

    for (const [index, infraction] of userData.infractions.entries()) {
      const timestamp = new Date(infraction.date).toLocaleString();

      fields.push({
        name: `Infraction #${index + 1}`,
        value: `Issuer: <@${infraction.issuerId}>\nReason: ${infraction.reason}\nTime: ${timestamp}`,
      });
    }

    infractionsEmbed.addFields(fields);

    await interaction.reply({ embeds: [infractionsEmbed] });
  },
};
