const schedule = require('node-schedule');
const { checkForNewSeries } = require("./scraper");

// execute every friday at 19:00
schedule.scheduleJob({hour: 19, minute: 00, dayOfWeek: 5}, () => {
  checkForNewSeries();
});

// TODO: added express here