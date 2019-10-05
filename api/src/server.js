import 'dotenv/config';
import Express from 'express';
import Mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import socketio from 'socket.io';
import http from 'http';
import routes from './routes';

const App = Express();
const Server = http.Server(App);
const io = socketio(Server);

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
});

App.use(cors());
App.use(Express.json());
App.use('/files', Express.static(path.resolve(__dirname, '..', 'uploads')));
App.use(routes);

Server.listen(process.env.APP_PORT);
