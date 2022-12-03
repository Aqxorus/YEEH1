//  GNU General Public License v3.0 - https://www.gnu.org/licenses/gpl-3.0.en.html
'use strict';
require('dotenv/config');
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

const { loadEvents } = require('./Handlers/eventHandler');

client.events = new Collection();
client.commands = new Collection();
client.color = "'Random'";

loadEvents(client);

try {
  client.login(process.env.TOKEN1);
} catch (error) {
  console.log(`[CRASH] Something went wrong while logging in the bot:\n`),
    console.error(error);
  process.exit();
}

process.on('unhandledRejection', async (reason, p) => {
  console.error(reason, 'Unhandled Rejection at Promise', p);
});
