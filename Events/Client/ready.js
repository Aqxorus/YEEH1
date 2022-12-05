'use strict';
const { ActivityType } = require('discord.js');
const { connect, connection } = require('mongoose');
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
    setInterval(() => {
      client.user.setActivity(`${client.guilds.cache.size} servers :(`, {
        type: ActivityType.Listening,
      });
    }, 1000 * 60 * 1.5); // Updates every 1.5 minutes

    const status = ['disconnected', 'connected', 'connecting', 'disconnecting'];

    try {
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
