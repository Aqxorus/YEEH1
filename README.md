# YEEH1

![banner](https://cdn.discordapp.com/attachments/910742787597676544/1126308541309911150/Untitled_design.png)

[![license](https://img.shields.io/github/license/Aqxorus/YEEH1)](./LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

---

## Table of Contents

#### • [Installation](#installation)

#### • [API](#api)

#### • [License](#license)

#### • [Features](#features)

## Installation

### 1. Install the required dependencies

```ps
pnpm install
```

### 2. Copy the contents inside the [config.example.json](./config.example.json) file, create a file named "config.json, and put in your information.

### 3. Change the Dev ID to your Account ID

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

This will allow you to run the developer commands which are [here](./src/Commands/Developer)

### 4. Run pnpm start || pnpm start:dev to run your bot.

## Features

### 1. Cooldown

You can set your default cooldown for commands in your config.json file, under the 'defaultCooldown' property.

```json
{
  "token": "TOKEN HERE",
  "mongoUri": "MONGO URI HERE",
  "defaultCooldown": 5 <-- This is for command cooldown
}
```

Additionally, you can also configure the cooldown per command like this:

```js
// Example command
module.exports = {
  cooldown: 10, // Set the cooldown in seconds
  data: new SlashCommandBuilder().setName('...'),
};
```

## API

This bot uses the [Discord API](https://discord.com/developers/docs/reference#api-reference)

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[Apache-2.0 © Aqxorus](./LICENSE)
