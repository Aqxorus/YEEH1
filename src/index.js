//  GNU General Public License v3.0 - https://www.gnu.org/licenses/gpl-3.0.en.html
'use strict';
const {
  Client,
  Partials,
  GatewayIntentBits: gtwyIntents,
  Collection,
} = require('discord.js');
const { Guilds, GuildMembers, GuildPresences } = gtwyIntents;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildPresences],
  partials: [User, Message, GuildMember, ThreadMember],
  failIfNotExists: false,
  allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true },
});

// Loads the commands and events
(async () => {
  const { loadEvents } = require('./Handlers/eventHandler');

  client.config = require('../config.json');
  client.events = new Collection();
  client.commands = new Collection();
  client.guildConfig = new Collection();

  loadEvents(client);
})().catch((err) => {
  console.error(err), process.exit(1);
});

client.login(client.config.token).catch((err) => {
  console.error(err), process.exit(1);
});
