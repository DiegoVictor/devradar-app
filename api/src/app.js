import 'dotenv/config';

import Express from 'express';
import Mongoose from 'mongoose';
import http from 'http';
import cors from 'cors';
import Sentry from '@sentry/node';

import routes from './routes';
import { setupWebSocket } from './websocket';

const App = Express();
const Server = http.Server(App);

setupWebSocket(Server);

if (process.env.SENTRY_DSN && process.env.LOG === '1') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
}

Mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

App.use(cors());
App.use(Express.json());
App.use(routes);
