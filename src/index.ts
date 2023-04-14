import path from 'path';
import express from 'express';
import { loadRoutes } from './routes';
import { validateEnv } from './helper/validator';
import { readCSVFile } from './controller/csvFileReader';

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

validateEnv();

const app = express();
loadRoutes(app);

app.listen(3000);