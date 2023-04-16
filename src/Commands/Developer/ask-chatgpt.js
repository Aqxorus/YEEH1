const {
  codeBlock,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require('discord.js');
const config = require('../../../config.json');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: config.apiKey,
});

const openai = new OpenAIApi(configuration);

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('gpt')
    .setDescription('Ask Chat-GPT for an answer or question! (DEV ONLY)')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('question')
        .setDescription('Ask Chat-GPT a question! (DEV ONLY)')
        .addStringOption((option) =>
          option
            .setName('q-content')
            .setDescription('What do you want to ask?')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('image')
        .setDescription('Ask Chat-GPT to generate an image! (DEV ONLY)')
        .addStringOption((option) =>
          option
            .setName('i-content')
            .setDescription('What do you want to generate?')
            .setRequired(true)
        )
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();

    const subCommand = interaction.options.getSubcommand();
    const question = interaction.options.getString('q-content');
    const image = interaction.options.getString('i-content');

    switch (subCommand) {
      case 'question':
        {
          await interaction.editReply({
            content: 'Please wait while your question is being processed!',
          });

          try {
            const response = await openai.createCompletion({
              model: 'gpt-3.5-turbo', // Chat-GPT model: gpt-3.5-turbo, Davinci model: text-davinci-003
              prompt: question,
              max_tokens: 2048, // 2048 because that's the maximum amount of characters in Discord
              temperature: 0.5,
            });

            interaction.editReply({
              content: 'Content:',
              embeds: [
                new EmbedBuilder()
                  .setTitle(`${question}`)
                  .setDescription(codeBlock(response.data.choices[0].text))
                  .setTimestamp(),
              ],
            }),
              interaction.channel.send(`<@${interaction.user.id}>`);
          } catch (error) {
            console.log(error);
            interaction.editReply({
              content: 'Request failed! Please try again later!',
            });
          }
        }
        break;

      case 'image':
        {
          await interaction.editReply({
            content: 'Please wait while your image is being generated!',
          });

          try {
            const response = await openai.createImage({
              prompt: image,
              n: 1, // Amount of images to send
              size: '1024x1024', // 256x256 or 512x512 or 1024x1024
            });

            interaction.editReply({
              content: 'Content:',
              embeds: [
                new EmbedBuilder()
                  .setTitle(`${image}`)
                  .setImage(response.data.data[0].url)
                  .setTimestamp(),
              ],
            }),
              interaction.channel.send(`<@${interaction.user.id}>`);
          } catch (error) {
            console.log(error);
            interaction.editReply({
              content: 'Request failed! Please try again later!',
            });
          }
        }
        break;
    }
  },
};
