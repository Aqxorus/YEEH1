// You can delete this if you want.
const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  PermissionFlagsBits,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription(`Says the provided text. (DEV ONLY)`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const modal = new ModalBuilder({
      customId: `myModal-${interaction.user.id}`,
      title: 'Say',
    });

    const thingToSay = new TextInputBuilder({
      customId: `sayInput`,
      label: 'What do you want to say? (Through the bot)',
      style: TextInputStyle.Paragraph,
    });

    const row = new ActionRowBuilder().addComponents(thingToSay);

    modal.addComponents(row);

    await interaction.showModal(modal);

    const filter = (interaction) =>
      interaction.customId === `myModal-${interaction.user.id}`;

    interaction
      .awaitModalSubmit({ filter, time: 30_000 })
      .then((modalInteraction) => {
        const sayInput = modalInteraction.fields.getTextInputValue('sayInput');

        modalInteraction.deferReply();
        modalInteraction.deleteReply();
        modalInteraction.channel.send(sayInput);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  },
};
