# YEEH1

![banner](https://cdn.discordapp.com/attachments/966577871579660288/1053891959091101716/Untitled_design.png)

[![license](https://img.shields.io/github/license/Aqxorus/YEEH1)](./LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

---

## Table of Contents

#### • [Installation](#installation)

#### • [API](#api)

#### • [License](#license)

## Installation

### Install the required dependencies

```ps
pnpm install
```

### Make a config.json file with these contents. (Obviously replace the content with your actual token and mongoUri.)

```json
{
  "token": "TOKEN HERE",
  "mongoUri": "MONGO URI HERE"
}
```

### Change the Dev ID to your Account ID

In [interactionCreate.js](./src/Events/Interactions/interactionCreate.js), change <font color='#FFFF00'>598624275083034654</font> to your discord account ID

```js
if (command.developer && interaction.user.id !== '598624275083034654')
  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor('Red')
        .setDescription('This command is only available to the developer.'),
    ],
    ephemeral: true,
  });
```

### Run pn start || pn start:dev to run your bot.

## API

This bot uses the [Discord API](https://discord.com/developers/docs/reference#api-reference)

---

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[GPL-3.0 © Aqxorus](./LICENSE)
