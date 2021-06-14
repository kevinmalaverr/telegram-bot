require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const { default: setEventService } = require('./services/setEvent');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.use(session());
setEventService(bot);

bot.start((ctx) => {
  ctx.reply('Hola 🖐');
});

bot.launch();
