'use strict';
const { ActivityType } = require('discord.js');
const { connect, connection, set } = require('mongoose');
const { loadCommands } = require('../../Handlers/commandHandler');
const { Client } = require('discord.js');
const { green } = require('chalk');

module.exports = {
  name: 'ready',
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    try {
      client.pickPresence = async () => {
        const options = [
          {
            type: ActivityType.Watching,
            text: `${client.guilds.cache.size} servers :(`,
            status: 'online',
          },
          {
            type: ActivityType.Playing,
            text: `made by 3v4n`,
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
    } catch (error) {
      console.error(error);
    }

    const status = ['disconnected', 'connected', 'connecting', 'disconnecting'];

    try {
      set('strictQuery', true);
      await connect(client.config.mongoUri).then(() => {
        setTimeout(() => {
          console.log(
            green(`[Database] MongoDB is ${status[connection.readyState]}`)
          );
        }, 1000 * 1);
      });
    } catch (error) {
      console.error(error),
        console.log(
          `[Event Handler] something went wrong while executing the ready event.`
        );
    }
    loadCommands(client);
  },
};
