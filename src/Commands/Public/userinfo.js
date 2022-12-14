//  GNU General Public License v3.0 - https://www.gnu.org/licenses/gpl-3.0.en.html
//  Developed by Kevin Foged, 1st of October 2022 - https://github.com/KevinFoged
const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription(
      'Displays the available information about the stated target.'
    )
    .setDMPermission(false)
    .addUserOption((options) =>
      options.setName('target').setDescription('Select the target.')
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const target =
      interaction.options.getMember('target') || interaction.member;
    const { user, presence, roles } = target;
    const formatter = new Intl.ListFormat('en-GB', {
      style: 'narrow',
      type: 'conjunction',
    });

    await user.fetch();

    const statusType = {
      idle: '1FJj7pX.png',
      dnd: 'fbLqSYv.png',
      online: 'JhW7v9d.png',
      invisible: 'dibKqth.png',
    };

    const activityType = [
      '๐น *Playing*',
      '๐ *Streaming*',
      '๐ง *Listening to*',
      '๐บ *Watching*',
      '๐คน๐ปโโ๏ธ *Custom*',
      '๐ *Competing in*',
    ];

    const clientType = [
      { name: 'desktop', text: 'Computer', emoji: '๐ป' },
      { name: 'mobile', text: 'Phone', emoji: '๐คณ๐ป' },
      { name: 'web', text: 'Website', emoji: '๐' },
      { name: 'offline', text: 'Offline', emoji: '๐ค' },
    ];

    const badges = {
      BugHunterLevel1: 'Bug Hunter Level 1',
      BugHunterLevel2: 'Bug Hunter Level 2',
      CertifiedModerator: 'Certified Moderator',
      HypeSquadOnlineHouse1: 'Hypesquad Bravery',
      HypeSquadOnlineHouse2: 'Hypesquad Brilliance',
      HypeSquadOnlineHouse3: 'Hypesquad Balance',
      Hypesquad: 'Hypesquad Event Attendee',
      Partner: 'Discord Partner',
      PremiumEarlySupporter: 'Nitro Early Supporter',
      Staff: 'Discord Staff',
      VerifiedBot: 'Verified Bot',
      VerifiedDeveloper: 'Verified Bot Developer',
    };

    const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
      let totalLength = 0;
      const result = [];

      for (const role of roles) {
        const roleString = `<@&${role.id}>`;

        if (roleString.length + totalLength > maxFieldLength) break;

        totalLength += roleString.length + 1; // +1 as it's likely we want to display them with a space between each role, which counts towards the limit.
        result.push(roleString);
      }

      return result.length;
    };

    const sortedRoles = roles.cache
      .map((role) => role)
      .sort((a, b) => b.position - a.position)
      .slice(0, roles.cache.size - 1);

    const clientStatus =
      presence?.clientStatus instanceof Object
        ? Object.keys(presence.clientStatus)
        : 'offline';
    const userFlags = user.flags.toArray();

    const deviceFilter = clientType.filter((device) =>
      clientStatus.includes(device.name)
    );
    const devices = !Array.isArray(deviceFilter)
      ? new Array(deviceFilter)
      : deviceFilter;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setAuthor({
            name: user.tag,
            iconURL: `https://i.imgur.com/${
              statusType[presence?.status || 'invisible']
            }`,
          })
          .setThumbnail(user.avatarURL({ size: 1024 }))
          .setImage(user.bannerURL({ size: 1024 }))
          .addFields(
            { name: 'ID', value: `๐ณ ${user.id}` },
            {
              name: 'Activities',
              value:
                presence?.activities
                  .map(
                    (activity) =>
                      `${activityType[activity.type]} ${activity.name}`
                  )
                  .join('\n') || 'None',
            },
            {
              name: 'Joined Server',
              value: `๐ค๐ป <t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: 'Account Created',
              value: `๐ <t:${parseInt(user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: 'Nickname',
              value: `๐ฆธ๐ปโโ๏ธ ${target.nickname || 'None'}`,
              inline: true,
            },
            {
              name: `Roles (${maxDisplayRoles(sortedRoles)} of ${
                sortedRoles.length
              })`,
              value: `${
                sortedRoles.slice(0, maxDisplayRoles(sortedRoles)).join(' ') ||
                'None'
              }`,
            },
            {
              name: `Badges (${userFlags.length})`,
              value: userFlags.length
                ? formatter.format(
                    userFlags.map((flag) => `**${badges[flag]}**`)
                  )
                : 'None',
            },
            {
              name: `Device`,
              value: devices
                .map((device) => `${device.emoji} ${device.text}`)
                .join('\n'),
              inline: true,
            },
            {
              name: 'Profile Colour',
              value: `๐จ ${user.hexAccentColor || 'None'}`,
              inline: true,
            },
            {
              name: 'Boosting Server',
              value: `๐๐ปโโ๏ธ ${
                roles.premiumSubscriberRole
                  ? `Since <t:${parseInt(
                      target.premiumSinceTimestamp / 1000
                    )}:R>`
                  : 'No'
              }`,
              inline: true,
            },
            { name: 'Banner', value: user.bannerURL() ? '** **' : '๐ None' }
          ),
      ],
      ephemeral: true,
    });
  },
};
