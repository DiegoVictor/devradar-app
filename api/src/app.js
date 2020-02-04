import 'dotenv/config';

import 'express-async-errors';
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

// eslint-disable-next-line no-unused-vars
App.use((err, req, res, next) => {
  const { payload } = err.output;

  if (err.data) {
    payload.details = err.data;
  }

  return res.status(payload.statusCode).json(payload);
});

