//  GNU General Public License v3.0 - https://www.gnu.org/licenses/gpl-3.0.en.html
'use strict';
const {
  Client,
  Partials,
  GatewayIntentBits: gtwyIntents,
  Collection,
} = require('discord.js');
const { Guilds, GuildMembers, GuildPresences, GuildMessages } = gtwyIntents;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildPresences, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
  failIfNotExists: false,
  allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true },
});

// Loads the commands, events and logs in the client
try {
  (async () => {
    const { loadEvents } = require('./Handlers/eventHandler');
    const { loadConfig } = require('./Functions/configLoader');

    client.config = require('../config.json');
    client.events = new Collection();
    client.commands = new Collection();
    client.guildConfig = new Collection();

    loadEvents(client);
    loadConfig(client);
  })();
} catch (err) {
  console.error(err);
}

client.login(client.config.token);
