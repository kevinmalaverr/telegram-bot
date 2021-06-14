require('dotenv').config();
const { Telegraf, Scenes, session } = require('telegraf');
const schedule = require('node-schedule');
const { generateSchedule, formatDate } = require('./timezone');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const events = [];

const contactDataWizard = new Scenes.WizardScene(
  'EVENT_REMINDER', // first argument is Scene_ID, same as for BaseScene
  (ctx) => {
    ctx.reply('What is your message?');
    ctx.wizard.state.event = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.message.text.length < 1) {
      ctx.reply('Please enter a message');
      return;
    }

    ctx.wizard.state.event.message = ctx.message.text;
    ctx.reply('Enter the date [AAAA/MM/DD hh:mm]');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.event.date = ctx.message.text;
    ctx.reply('The event was created');
    console.log(ctx.wizard.state.event);
    events.push(ctx.wizard.state);
    try {
      const date = new Date(...formatDate(ctx.wizard.state.event.date));

      schedule.scheduleJob(date, () => {
        ctx.reply(
          ctx.wizard.state.event.message + '\n' + generateSchedule(date)
        );
      });
    } catch (error) {
      console.error(error);
    }

    return ctx.scene.leave();
  }
);

formatDate('2021/06/12 17:00');

const stage = new Scenes.Stage([contactDataWizard]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.reply('hola 🖐');
});

bot.command('test', (ctx) => {
  console.log(ctx);
  ctx.reply(`🇨🇴🇵🇪 5:00 pm \n🇦🇷 7:00 pm \n🇻🇪 4:00 pm`);
});

bot.command('event', (ctx) => {
  ctx.scene.enter('EVENT_REMINDER');
});

bot.launch();
