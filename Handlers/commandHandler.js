async function loadCommands(client) {
  const { loadFiles } = require('../Functions/fileLoader');
  const ascii = require('ascii-table');
  const table = new ascii().setHeading('Commands', 'Status');
  const chalk = require('chalk');

  await client.commands.clear();

  let commandsArray = [];

  const Files = await loadFiles('Commands');

  Files.forEach((file) => {
    const command = require(file);
    client.commands.set(command.data.name, command);

    commandsArray.push(command.data.toJSON());

    table.addRow(command.data.name, 'Loaded');
  });

  client.application.commands.set(commandsArray);

  return console.log(chalk.blueBright(table.toString(), '\nLoaded Commands'));
}

module.exports = { loadCommands };
