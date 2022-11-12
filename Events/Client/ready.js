const { ActivityType } = require('discord.js');
const { connect } = require('mongoose');
const { loadCommands } = require('../../Handlers/commandHandler');
const chalk = require('chalk');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    const promises = [
      client.shard.fetchClientValues('guilds.cache.size'),
      client.shard.broadcastEval((c) =>
        c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
      ),
    ];

    Promise.all(promises).then((results) => {
      const totalGuilds = results[0].reduce(
        (acc, guildCount) => acc + guildCount,
        0
      );
      setInterval(() => {
        client.user.setActivity(`${totalGuilds} servers :(`, {
          type: ActivityType.Listening,
        });
      }, 1000);
    });

    connect(process.env.MONGO_URI) || '',
      setTimeout(() => {
        console.log(chalk.green('[Database] MongoDB is connected'));
      }, 1000 * 1);
    loadCommands(client);
  },
};
