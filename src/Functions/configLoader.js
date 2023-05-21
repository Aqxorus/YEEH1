'use strict';
const { greenBright } = require('colorette');
const configDatabase = require('../Models/memberLog');

async function loadConfig(client) {
  (await configDatabase.find()).forEach((doc) => {
    client.guildConfig.set(doc.Guild, {
      logChannel: doc.logChannel,
      memberRole: doc.memberRole,
      botRole: doc.botRole,
    });
  });
  return console.info(
    greenBright('[Config Loader] Loaded Config/s to the collection')
  );
}

module.exports = { loadConfig };
