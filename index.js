require('dotenv').config();
const { Telegraf, Scenes, session } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const contactDataWizard = new Scenes.WizardScene(
  'CONTACT_DATA_WIZARD_SCENE_ID', // first argument is Scene_ID, same as for BaseScene
  (ctx) => {
    ctx.reply('What is your name?');
    ctx.wizard.state.contactData = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    // validation example
    if (ctx.message.text.length < 2) {
      ctx.reply('Please enter name for real');
      return;
    }
    ctx.wizard.state.contactData.fio = ctx.message.text;
    ctx.reply('Enter your e-mail');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.contactData.email = ctx.message.text;
    ctx.reply('Thank you for your replies, well contact your soon');
    console.log(ctx.wizard.state.contactData);
    return ctx.scene.leave();
  }
);

const stage = new Scenes.Stage([contactDataWizard]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.reply('hola 🖐');
});

bot.command('event', (ctx) => {
  ctx.scene.enter('CONTACT_DATA_WIZARD_SCENE_ID');
});

bot.launch();
