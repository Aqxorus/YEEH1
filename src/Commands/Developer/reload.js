// Only use this if you've made a change in the bot and want to reload the commands or events without restarting the bot.
const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
  EmbedBuilder,
} = require('discord.js');

const { loadCommands } = require('../../Handlers/commandHandler');
const { loadEvents } = require('../../Handlers/eventHandler');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription(`Reloads the events/commands.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand((options) =>
      options.setName('events').setDescription('(DEV ONLY)')
    ) // Reloads the events
    .addSubcommand((options) =>
      options.setName('commands').setDescription('(DEV ONLY)')
    ), // Reloads the commands
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case 'events':
        {
          for (const [key, value] of client.events)
            client.removeListener(`${key}`, value, true);
          loadEvents(client);
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor('Green')
                .setDescription('Reloaded Events.'),
            ],
            // content: 'Reloaded Events.', - standard message replies
            ephemeral: true,
          });
        }
        break;
      case 'commands':
        {
          loadCommands(client);
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor('Green')
                .setDescription('Reloaded Commands.'),
            ],
            // content: 'Reloaded Commands.', - standard message replies
            ephemeral: true,
          });
        }
        break;
    }
  },
};
