require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const { default: setEventService } = require('../services/setEvent');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN, {
  telegram: { webhookReply: false },
});

bot.use(session());
setEventService(bot);

bot.start((ctx) => {
  ctx.reply('Hola 🖐');
});

if (process.env.mode !== 'production') {
  bot.launch();
}

module.exports = (request, response) => {
  try {
    initBot();
    bot.handleUpdate(request.body);
    response.send('OK');
  } catch (error) {
    response.send('ERROR');
  }
};
