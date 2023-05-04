'use strict';
const { ActivityType } = require('discord.js');
const { connect, connection, set } = require('mongoose');
const { loadCommands } = require('../../Handlers/commandHandler');
const { Client } = require('discord.js');
const chalk = require('chalk');

module.exports = {
  name: 'ready',
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    // Status changer
    (async function () {
      const req = await client.shard.fetchClientValues('guilds.cache.size');
      const totalGuilds = req.reduce((p, n) => p + n, 0);

      client.pickPresence = async () => {
        const options = [
          {
            type: ActivityType.Watching,
            text: `${totalGuilds} servers | Shard ${
              Number(client?.shard?.ids) + 1
                ? Number(client?.shard?.ids) + 1
                : '1'
            }`,
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

    set('strictQuery', true);
    await connect(client.config.mongoUri).then(() => {
      setTimeout(() => {
        console.log(
          chalk.green(
            `[Database] MongoDB is ${mongoStatus[connection.readyState]}`
          )
        );
      }, 1000 * 1);
    });

    await loadCommands(client);
  },
};
