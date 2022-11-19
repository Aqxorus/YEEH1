const { ActivityType } = require('discord.js');
const { connect } = require('mongoose');
const { loadCommands } = require('../../Handlers/commandHandler');
const chalk = require('chalk');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    setInterval(() => {
      client.user.setActivity(`${client.guilds.cache.size} servers :(`, {
        type: ActivityType.Listening,
      });
    }, 1000 * 60 * 1.5);

    await connect(process.env.MONGO_URI)
      .then(() => {
        setTimeout(() => {
          console.log(chalk.green('[Database] MongoDB is connected'));
        }, 1000 * 1);
      })
      .catch((err) => {
        console.log('err');
      });
    loadCommands(client);
  },
};
