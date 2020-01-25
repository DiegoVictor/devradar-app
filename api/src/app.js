import 'dotenv/config';

import 'express-async-errors';
import Express from 'express';
import Mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import http from 'http';
import Sentry from '@sentry/node';
import helmet from 'helmet';

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
  useFindAndModify: false,
});

App.use(helmet());

App.use(cors());
App.use(Express.json());
App.use('/files', Express.static(path.resolve(__dirname, '..', 'uploads')));
App.use(routes);

// eslint-disable-next-line no-unused-vars
App.use((err, req, res, next) => {
  const { payload } = err.output;

  if (err.data) {
    payload.details = err.data;
  }

  return res.status(payload.statusCode).json(payload);
});

export default Server;
