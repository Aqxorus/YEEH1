// Displays information about the stated target
const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  AttachmentBuilder,
  InteractionContextType,
} = require('discord.js');
const { Profile } = require('discord-arts');

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription(
      'Displays the available information about the stated target.'
    )
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) =>
      option
        .setName('input')
        .setDescription('Select the user')
        .setRequired(false)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();

    function addSuffix(number) {
      if (number % 100 >= 11 && number % 100 <= 13) {
        return number + 'th';
      }

      switch (number % 10) {
        case 1:
          return number + 'st';
        case 2:
          return number + 'nd';
        case 3:
          return number + 'rd';
      }
      return number + 'th';
    }

    const target = interaction.options.getMember('input') || interaction.member;
    const { user, presence, roles } = target;

    const fetchedMembers = await interaction.guild.members.fetch();

    const profileBuffer = await Profile(target.id);
    const imageAttachment = new AttachmentBuilder(profileBuffer, {
      name: 'profile.png',
    });

    const joinPosition =
      Array.from(
        fetchedMembers
          .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
          .keys()
      ).indexOf(target.id) + 1;

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
      '🕹 *Playing*',
      '🎙 *Streaming*',
      '🎧 *Listening to*',
      '📺 *Watching*',
      '🤹🏻‍♀️ *Custom*',
      '🏆 *Competing in*',
    ];

    const clientType = [
      { name: 'desktop', text: 'Computer', emoji: '💻' },
      { name: 'mobile', text: 'Phone', emoji: '🤳🏻' },
      { name: 'web', text: 'Website', emoji: '🌍' },
      { name: 'offline', text: 'Offline', emoji: '💤' },
    ];

    const badges = {
      BugHunterLevel1: '<:bugHunterLogo:1102127658311102476>',
      BugHunterLevel2: '<:goldBugHunterLogo:1102128374811480124>',
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
      ActiveDeveloper: 'Active Developer',
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

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor('Random')
          .setDescription(
            `${target.user.username} is the **${addSuffix(
              joinPosition
            )}** member of this server`
          )
          .setAuthor({
            name: user.tag,
            iconURL: `https://i.imgur.com/${
              statusType[presence?.status || 'invisible']
            }`,
          })
          // .setThumbnail(user.avatarURL({ size: 1024 }))
          .setImage('attachment://profile.png')
          .addFields(
            { name: 'ID', value: `💳 ${user.id}` },
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
              value: `🤝🏻 <t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: 'Account Created',
              value: `📆 <t:${parseInt(user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: 'Nickname',
              value: `🦸🏻‍♀️ ${target.nickname || 'None'}`,
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
              value: `🎨 ${user.hexAccentColor || 'None'}`,
              inline: true,
            },
            {
              name: 'Boosting Server',
              value: `🏋🏻‍♀️ ${
                roles.premiumSubscriberRole
                  ? `Since <t:${parseInt(
                      target.premiumSinceTimestamp / 1000
                    )}:R>`
                  : 'No'
              }`,
              inline: true,
            },
            { name: 'Banner', value: user.bannerURL() ? '** **' : '🎏 None' }
          ),
      ],
      files: [imageAttachment],
    });
  },
};
