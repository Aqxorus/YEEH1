//  GNU General Public License v3.0 - https://www.gnu.org/licenses/gpl-3.0.en.html
//  Developed by Kevin Foged, 1st of October 2022 - https://github.com/KevinFoged

const {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
  version,
} = require('discord.js');

const { connection } = require('mongoose');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Displays the status of the client and database.'),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
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

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(interaction.guild.members.me.roles.highest.hexColor)
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
                `👑 **Owner** ${
                  client.application.owner
                    ? `<@${client.application.owner.id}> (${client.application.owner.tag})`
                    : 'None'
                }`,
                `🏷 **Tags** ${
                  client.application.tags.length
                    ? formatter.format(
                        client.application.tags.map((tag) => `*${tag}*`)
                      )
                    : 'None'
                }`,
                `<:clipboard:1040830928798351483> **Commands** ${client.commands.size}`,
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
                `👩🏻‍🔧 **Node.js** ${process.version}`,
                `🛠 **Discord.js** ${version}`,
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
