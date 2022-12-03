'use strict';
const { ActivityType } = require('discord.js');
const { connect, connection } = require('mongoose');
const { loadCommands } = require('../../Handlers/commandHandler');
const { Client } = require('discord.js');
const { green, blue } = require('chalk');

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
    }, 1000 * 60 * 1.5);

    const status = ['disconnected', 'connected', 'connecting', 'disconnecting'];

    try {
      await connect(process.env.MONGO_URI).then(() => {
        setTimeout(() => {
          console.log(
            green(`[Database] MongoDB is ${status[connection.readyState]}`)
          ),
            console.log(blue(`Logged in as ${client.user.tag}`));
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
