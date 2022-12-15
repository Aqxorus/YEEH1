const configDatabase = require('../Models/memberLog');
async function loadConfig(client) {
  (await configDatabase.find()).forEach((doc) => {
    client.guildConfig.set(doc.Guild, {
      logChannel: doc.logChannel,
      memberRole: doc.memberRole,
      botRole: doc.botRole,
    });
  });
}

module.exports = { loadConfig };
