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
    const mongoStatus = [
      'disconnected',
      'connected',
      'connecting',
      'disconnecting',
    ];

    try {
      mongoose.set('strictQuery', false);
      // mongoose.set('bufferTimeoutMS', 500);
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

    // Status changer
    try {
      const options = [
        {
          type: ActivityType.Watching,
          text: `over ${client.guilds.cache.size} servers`,
          status: 'online',
        },
        {
          type: ActivityType.Custom,
          text: '⚡ /about | aqxorus.me',
        },
        {
          type: ActivityType.Listening,
          text: `${client.commands.size} commands`,
          status: 'online',
        },
      ];

      let counter = 0;

      client.pickPresence = async () => {
        client.user.setPresence({
          status: options[counter].status,
          activities: [
            {
              name: options[counter].text,
              type: options[counter].type,
            },
          ],
        });

        if (++counter >= options.length) {
          counter = 0;
        }

        setTimeout(client.pickPresence, 1000 * 20);
      };

      client.pickPresence();
    } catch (error) {
      console.error(error);
    }
  },
};
