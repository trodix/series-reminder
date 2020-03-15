import express, { Application, Request, Response } from 'express';
import schedule from 'node-schedule';
import { checkForNewSeries } from './scraper';

const app: Application = express();
const PORT: number = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('ok');
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}...`);
});

// execute every friday at 19:00
schedule.scheduleJob({hour: 19, minute: 0, dayOfWeek: 5}, () => {
  checkForNewSeries();
});