import path from 'path';
import express from 'express';
import { loadRoutes } from './routes';
import { validateEnv } from './helper/validateEnv';
import * as Scheduler  from './controller/schedule';

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

validateEnv();

const app = express();
loadRoutes(app);

app.listen(3000, async () => {
  console.log('===== App starts =====');
  await Scheduler.scheduleTask();
  console.log('===== Schedule Task =====');
});
