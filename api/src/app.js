import 'dotenv/config';

import 'express-async-errors';
import Express from 'express';
import Mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import socketio from 'socket.io';
import http from 'http';
import Sentry from '@sentry/node';

import routes from './routes';

const App = Express();
export const Server = http.Server(App);
const io = socketio(Server);

if (process.env.LOG === '1') {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

// Use Redis to relate users and socket id
const connections = {};

io.on('connection', socket => {
  const { user_id } = socket.handshake.query;
  connections[user_id] = socket.id;
});

App.use((req, res, next) => {
  req.io = io;
  req.connections = connections;
  return next();
});

Mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

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
