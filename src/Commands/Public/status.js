// Displays the status of the bot and database.
const {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
  version,
  UserFlags,
} = require('discord.js');
const { connection } = require('mongoose');
const os = require('os');
const pkgjson = require('../../../package.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Displays the status of the client/bot and database.')
    .setDMPermission(false),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();

    const formatter = new Intl.ListFormat('en-GB', {
      style: 'long',
      type: 'conjunction',
    });

    const status = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];

    await client.user.fetch();
    await client.application.fetch();

    const getChannelTypeSize = (type) =>
      client.channels.cache.filter((channel) => type.includes(channel.type))
        .size;

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setTitle(`${client.user.username}'s Status`)
          .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
          .addFields(
            {
              name: 'Description',
              value: `📝 ${client.application.description || 'None'}`,
            },
            {
              name: 'General',
              value: [
                `👩🏻‍🔧 **Client** ${client.user.tag}`,
                `💳 **ID** ${client.user.id}`,
                `📆 **Created** <t:${parseInt(
                  client.user.createdTimestamp / 1000
                )}:R>`,
                `👑 **Owner** <@598624275083034654>`,
                `<:verifiedBotLogo:1104361951515127850> **Verified** ${
                  client.user.flags & UserFlags.VerifiedBot ? 'Yes' : 'No'
                }`,
                `🏷 **Tags** ${
                  client.application.tags.length
                    ? formatter.format(
                        client.application.tags.map((tag) => `*${tag}*`)
                      )
                    : 'None'
                }`,
                `<:clipboard:1047416388660240464> **Commands** ${client.commands.size}`,
              ].join('\n'),
            },
            {
              name: 'System',
              value: [
                `🖥 **Operating System** ${os
                  .type()
                  .replace('Windows_NT', 'Windows')
                  .replace('Darwin', 'macOS')}`,
                `⏰ **Up Since** <t:${parseInt(
                  client.readyTimestamp / 1000
                )}:R>`,
                `🏓 **Ping** ${client.ws.ping}ms`,
                `🧠 **CPU Model** ${os.cpus()[0].model}`,
                `💾 **CPU Usage** ${(
                  process.memoryUsage().heapUsed /
                  1024 /
                  1024
                ).toFixed(2)}%`,
                `📚 **Database** ${status[connection.readyState]}`,
                `🔢 **Bot version** v${pkgjson.version}`,
                `👩🏻‍🔧 **Node.js** ${process.version}`,
                `🛠 **Discord.js** ${version}`,
                `<:nodejslogo:1102126103931404380> **Language** Javascript`,
              ].join('\n'),
              inline: true,
            },
            {
              // Using the caches for some of these isn't always reliable, but it would be a waste of resources to loop through all servers every single time someone used this command.
              name: 'Statistics',
              value: [
                `🌍 **Servers** ${client.guilds.cache.size}`,
                `👨‍👩‍👧‍👦 **Users** ${client.users.cache.size}`,
                `📝 **Emojis** ${client.emojis.cache.size}`,
                `💬 **Text Channels** ${getChannelTypeSize([
                  ChannelType.GuildText,
                  ChannelType.GuildForum,
                  ChannelType.GuildAnnouncement,
                ])}`,
                `🎙 **Voice Channels** ${getChannelTypeSize([
                  ChannelType.GuildVoice,
                  ChannelType.GuildStageVoice,
                ])}`,
                `🧵 **Threads** ${getChannelTypeSize([
                  ChannelType.PublicThread,
                  ChannelType.PrivateThread,
                  ChannelType.AnnouncementThread,
                ])}`,
              ].join('\n'),
              inline: true,
            }
          ),
      ],
      ephemeral: false,
    });
  },
};
