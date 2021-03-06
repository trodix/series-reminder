import bodyParser from 'body-parser';
import express, { Application } from 'express';
import schedule from 'node-schedule';
import path from 'path';
import webpush from 'web-push';
import { checkForNewSeries } from './scraper';
import dotenv from 'dotenv';
import socket from 'socket.io';

dotenv.config();

const PORT: any = process.env.PORT || 3000;
const VAPID_PUBLIC_KEY: any = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY: any = process.env.VAPID_PRIVATE_KEY;

const app: Application = express();
const connectionList: any[] = [];

webpush.setVapidDetails(
  'mailto:sebastien.vallet89@gmail.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const server = app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}...`);
});

const io = socket(server);

io.on('connection', (client) => {
  const now = new Date().toISOString();
  console.log(`[${now}] - New connection`);
  connectionList.push(client.id);

  client.on('subscribe', (subscription) => {
    console.log(`[${now}] - Subscribed with payload:`);
    console.log(subscription);
    const payload = JSON.stringify({ title: 'Welcome', body: 'You just subscribed to the series feed!' });
    webpush.sendNotification(subscription, payload).catch(err => console.error(err));
  });
});

// execute every friday at 19:00
// schedule.scheduleJob({hour: 19, minute: 0, dayOfWeek: 5}, () => {
schedule.scheduleJob('* * * * *', () => {
  checkForNewSeries().then(data => {
    console.log(data);
    // FIXME: send notifications
    io.sockets.emit('notify', { data });
  });
});
