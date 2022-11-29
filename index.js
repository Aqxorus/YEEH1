//  GNU General Public License v3.0 - https://www.gnu.org/licenses/gpl-3.0.en.html
'use strict';

require('dotenv').config();
const { Client, Partials, IntentsBitField, Collection } = require('discord.js');
const { Guilds, GuildMembers, MessageContent, GuildPresences, GuildMessages } =
  IntentsBitField.Flags;
const { User, Message, GuildMember, ThreadMember } = Partials;
const { red } = require('chalk');

const botIntents = new IntentsBitField().add(
  Guilds,
  GuildMembers,
  MessageContent,
  GuildPresences,
  GuildMessages
);

const client = new Client({
  intents: botIntents,
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require('./Handlers/eventHandler');

client.events = new Collection();
client.commands = new Collection();

loadEvents(client);

client.login(process.env.TOKEN1).catch((err) => {
  console.log(`[CRASH] Something went wrong while logging in the bot` + '\n'),
    console.error(err),
    process.exit();
});

process.on('unhandledRejection', async (err) => {
  console.log(red(`[CRASH] Unhandled Rejection:` + '\n')), console.error(err);
});
