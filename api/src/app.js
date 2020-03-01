import 'dotenv/config';

import 'express-async-errors';
import cors from 'cors';
import Express from 'express';
import http from 'http';
import helmet from 'helmet';
import Sentry from '@sentry/node';
import RateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from 'redis';

import routes from './routes';
import './database';
import { setupWebSocket } from './websocket';

const App = Express();
const Server = http.Server(App);

setupWebSocket(Server);

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
}

App.use(helmet());

App.use(cors());
App.use(Express.json());

if (process.env.NODE_ENV !== 'test') {
  App.use(
    new RateLimit({
      max: 100,
      windowMs: 1000 * 60 * 15,
      store: new RedisStore({
        client: redis.createClient({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        }),
      }),
    })
  );
}

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
