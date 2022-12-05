//  GNU General Public License v3.0 - https://www.gnu.org/licenses/gpl-3.0.en.html
'use strict';
const { Client, Partials, IntentsBitField, Collection } = require('discord.js');
const { Guilds, GuildMembers, MessageContent, GuildPresences, GuildMessages } =
  IntentsBitField.Flags;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [
    Guilds,
    GuildMembers,
    MessageContent,
    GuildPresences,
    GuildMessages,
  ],
  partials: [User, Message, GuildMember, ThreadMember],
  failIfNotExists: false,
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
});

client.config = require('./config.json');

const { loadEvents } = require('./Handlers/eventHandler');

client.events = new Collection();
client.commands = new Collection();
client.color = "'Random'";

loadEvents(client);

client.login(client.config.token1).catch(async (err) => {
  console.error(`Something happened while logging in the client:`, err),
    process.exit(1);
});

process.on('unhandledRejection', async (p) => {
  console.error('Unhandled Rejection at Promise\n', p);
});
