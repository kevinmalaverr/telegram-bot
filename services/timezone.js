const moment = require('moment-timezone');

const zones = [
  ['🇲🇽', 'America/Mexico_City'],
  ['🇨🇴', 'America/Bogota'],
  ['🇵🇪', 'America/Lima'],
  ['🇨🇱', 'America/Santiago'],
  ['🇦🇷', 'America/Buenos_Aires'],
  ['🇺🇾', 'America/Montevideo'],
  ['🇪🇨', 'America/Guayaquil'],
  ['🇻🇪', 'America/Caracas'],
  // ['🇵🇾', 'America/Asuncion'],
  // ['🇧🇴', 'America/La_Paz'],
  // ['🇪🇸', 'Europe/Madrid'],
  // ['🇬🇹', 'America/Guatemala'],
  // ['🇸🇻', 'America/El_Salvador'],
];

function generateSchedule(time) {
  const date = moment(time);
  const res = {};
  for (const zone of zones) {
    const hour = date.tz(zone[1]).format('ha');
    if (res[hour]) res[hour] += ' ' + zone[0];
    else res[hour] = zone[0];
  }

  let timesAndFlags = '';
  Object.keys(res).map((time) => {
    timesAndFlags += `${time} ${res[time]}\n`;
  });

  return timesAndFlags;
}

function formatDate(date) {
  let res = /(\d*)\/(\d*)\/(\d*) (\d*):(\d*)/.exec(date);
  res = res.slice(1).map((n) => parseInt(n));
  res[1] = res[1] - 1;

  return res;
}

module.exports = {
  generateSchedule,
  formatDate,
};
