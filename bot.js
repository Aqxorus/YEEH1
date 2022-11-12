//  GNU General Public License v3.0 - https://www.gnu.org/licenses/gpl-3.0.en.html
require('dotenv/config');
const { Client, IntentsBitField, Partials, Collection } = require('discord.js');
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
});

const { loadEvents } = require('./Handlers/eventHandler');

client.events = new Collection();
client.commands = new Collection();

loadEvents(client);

client.login(process.env.TOKEN1);
