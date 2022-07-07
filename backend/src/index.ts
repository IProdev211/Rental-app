import express, { Express, Request, Response } from 'express';
import cors from 'cors'
import helmet from 'helmet'
import admin from 'firebase-admin'
import dotenv from 'dotenv';

import Router from './routers'

const serviceAccount = require("./firebase/serviceAccountKey.json");

var bodyParser = require('body-parser')

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const app: Express = express();
const port = process.env.PORT;

app.use(cors())
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.use(helmet());
app.use('/api', Router);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port || 5000, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});