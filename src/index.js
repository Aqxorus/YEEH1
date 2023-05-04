const config = require('../config.json');
const chalk = require('chalk');
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./src/bot.js', {
  token: config.token,
});

manager.on('shardCreate', (shard) =>
  console.log(chalk.blueBright(`[Shard Manager] Launched shard ${shard.id}`))
);

manager.spawn();
