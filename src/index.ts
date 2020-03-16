import bodyParser from 'body-parser';
import express, { Application, Request, Response } from 'express';
import schedule from 'node-schedule';
import path from 'path';
import webpush from 'web-push';
import { checkForNewSeries } from './scraper';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT: any = process.env.PORT || 3000;
const VAPID_PUBLIC_KEY: any = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY: any = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  'mailto:sebastien.vallet89@gmail.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}...`);
});

app.post('/subscribe', (req: Request, res: Response) => {
  const subscription = req.body;

  res.status(201).json({
    subscribedAt: new Date()
  });

  const payload = JSON.stringify({ title: 'Welcome', body: 'You just subscribed to the series feed!' });

  webpush.sendNotification(subscription, payload).catch(err => console.error(err));

});

// execute every friday at 19:00
schedule.scheduleJob({hour: 19, minute: 0, dayOfWeek: 5}, () => {
  checkForNewSeries().then(response => {
    console.log(response);
    // TODO: send notifications
  });
});
