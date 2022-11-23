const { ActivityType } = require('discord.js');
const { connect, connection } = require('mongoose');
const { loadCommands } = require('../../Handlers/commandHandler');
const chalk = require('chalk');
const { green } = chalk;

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    setInterval(() => {
      client.user.setActivity(`${client.guilds.cache.size} servers :(`, {
        type: ActivityType.Listening,
      });
    }, 1000 * 60 * 1.5);

    const status = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];

    try {
      await connect(process.env.MONGO_URI).then(() => {
        setTimeout(() => {
          console.log(
            green(`[Database] MongoDB is ${status[connection.readyState]}.`)
          );
        }, 1000 * 1);
      });
    } catch (error) {
      console.error(error);
      console.log(
        `[Event Handler] something went wrong while executing the ready event.`
      );
    }
    loadCommands(client);
  },
};
