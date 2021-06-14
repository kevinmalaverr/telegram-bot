const { Scenes } = require('telegraf');
const schedule = require('node-schedule');
const { generateSchedule, formatDate } = require('./timezone');

const setEventService = (bot) => {
  const eventScene = new Scenes.WizardScene(
    'EVENT_REMINDER',
    (ctx) => {
      ctx.reply('¿Cuál es el mensaje del evento?');
      ctx.wizard.state.event = {};
      return ctx.wizard.next();
    },
    (ctx) => {
      if (ctx.message.text.length < 1) {
        ctx.reply('Por favor ingrese un mensaje');
        return;
      }

      ctx.wizard.state.event.message = ctx.message.text;
      ctx.reply('Ingrese la fecha [AAAA/MM/DD hh:mm]');
      return ctx.wizard.next();
    },
    async (ctx) => {
      ctx.wizard.state.event.date = ctx.message.text;
      try {
        const date = new Date(...formatDate(ctx.wizard.state.event.date));
        ctx.reply('El evento fue creado para ' + date.toUTCString());

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

  const stage = new Scenes.Stage([eventScene]);
  bot.use(stage.middleware());

  bot.command('event', (ctx) => {
    ctx.scene.enter('EVENT_REMINDER');
  });
};

exports.default = setEventService;
