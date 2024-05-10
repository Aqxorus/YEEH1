// ⚠ Only use this if you've made a change in the bot and want to reload the commands or events without restarting the bot.
const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription(`Leaves a server`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('enter guild id to leave (type `list` for all guilds)')
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      const id = interaction.options.getString('id');

      if (id.toLowerCase() === 'list') {
        client.guilds.cache.forEach((guild) => {
          console.log(`${guild.name} | ${guild.id}`);
        });
        const guild = client.guilds.cache.map(
          (guild) => ` ${guild.name} | ${guild.id}`
        );
        try {
          return interaction.reply({
            content: `Guilds:\n\`${guild}\``,
            ephemeral: true,
          });
        } catch {
          return interaction.reply({
            content: `check console for list of guilds`,
            ephemeral: true,
          });
        }
      }

      const guild = client.guilds.cache.get(id);

      if (!guild) {
        return interaction.reply({
          content: `\`${id}\` is not a valid guild id`,
          ephemeral: true,
        });
      }

      await guild
        .leave()
        .then((c) => console.log(`Left guild ${id}`))
        .catch((err) => {
          console.log(err);
        });
      return interaction.reply({
        content: `Left guild \`${id}\``,
        ephemeral: true,
      });
    } catch (error) {
      console.log(`there was an error trying to leave guild ${id}`, error);
    }
  },
};
