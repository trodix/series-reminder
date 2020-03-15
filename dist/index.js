"use strict";
// const schedule = require('node-schedule');
// const { checkForNewSeries } = require("./scraper");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // execute every friday at 19:00
// schedule.scheduleJob({hour: 19, minute: 00, dayOfWeek: 5}, () => {
//   checkForNewSeries();
// });
// // TODO: added express here
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const PORT = 3000;
app.get('/', (req, res) => {
    res.send('ok');
});
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}...`);
});
