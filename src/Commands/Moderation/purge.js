const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription(
      'Purge a specific amount of messages from a target or channel.'
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('all')
        .setDescription('Removes all types of messages.')
        .addIntegerOption((options) =>
          options
            .setName('count')
            .setDescription('Input count.')
            .setMinValue(1)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('user')
        .setDescription('Removes all messages from the stated user.')
        .addIntegerOption((options) =>
          options
            .setName('count')
            .setDescription('Input count.')
            .setMinValue(1)
            .setRequired(true)
        )
        .addUserOption((options) =>
          options
            .setName('user')
            .setDescription('Input user.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('bot')
        .setDescription('Removes bot messages.')
        .addIntegerOption((options) =>
          options
            .setName('count')
            .setDescription('Input count.')
            .setMinValue(1)
            .setRequired(true)
        )
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    let amount = interaction.options.getInteger('count');
    if (amount >= 100) amount = 100;
    if (amount < 1) amount = 1;
    const fetch = await interaction.channel.messages.fetch({ limit: amount });
    const user = interaction.options.getUser('user');

    async function results(deletedMessages) {
      const results = {};
      for (const [, deleted] of deletedMessages) {
        const user = `${deleted.author.username}#${deleted.author.discriminator}`;
        if (!results[user]) results[user] = 0;
        results[user]++;
      }

      const userMessageMap = Object.entries(results);

      const finalResult = `${deletedMessages.size} message${
        deletedMessages.size > 1 ? 's' : ''
      } were removed!\n\n${userMessageMap
        .map(([user, messages]) => `**${user}** : ${messages}`)
        .join('\n')}`;

      const msg = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Green')
            .setDescription(`${finalResult}`)
            .setFooter({ text: 'Deleting message in 5 seconds...' }),
        ],
        // content: `${finalResult}`, - standard message replies
        fetchReply: true,
      });
      setTimeout(() => {
        msg.delete();
      }, 5000);
    }

    let filtered;
    let deletedMessages;

    switch (interaction.options.getSubcommand()) {
      case 'all':
        deletedMessages = await interaction.channel.bulkDelete(fetch, true);
        results(deletedMessages);
        break;

      case 'bot':
        filtered = fetch.filter((m) => m.author.bot);
        deletedMessages = await interaction.channel.bulkDelete(filtered, true);
        results(deletedMessages);

        break;
      case 'user':
        filtered = fetch.filter((m) => m.author.id === user.id);
        deletedMessages = await interaction.channel.bulkDelete(filtered, true);
        results(deletedMessages);
    }
  },
};
