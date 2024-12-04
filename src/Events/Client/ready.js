'use strict';
const { ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const { loadCommands } = require('../../Handlers/commandHandler');
const { Client } = require('discord.js');
const { green } = require('colorette');

module.exports = {
  name: 'ready',
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    // Status changer
    (async function () {
      client.pickPresence = async () => {
        const options = [
          {
            type: ActivityType.Watching,
            text: `over ${client.guilds.cache.size} servers`,
            status: 'online',
          },
          {
            type: ActivityType.Listening,
            text: `${client.commands.size} commands`,
            status: 'online',
          },
        ];

        const option = Math.floor(Math.random() * options.length);

        client.user.setPresence({
          activities: [
            {
              name: options[option].text,
              type: options[option].type,
            },
          ],
          status: options[option].status,
        });
      };

      setInterval(client.pickPresence, 1000 * 10);
    })().catch(console.error);

    const mongoStatus = [
      'disconnected',
      'connected',
      'connecting',
      'disconnecting',
    ];

    try {
      mongoose.set('strictQuery', false);
      mongoose.set('bufferTimeoutMS', 500);
      await mongoose.connect(client.config.mongoUri).then(() => {
        setTimeout(() => {
          console.info(
            green(
              `[Database] MongoDB is ${
                mongoStatus[mongoose.connection.readyState]
              }`
            )
          );
        }, 1000 * 1);
      });
    } catch (error) {
      handleError(error);
    }

    await loadCommands(client);
  },
};
