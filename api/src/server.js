import 'dotenv/config';
import Express from 'express';
import Mongoose from 'mongoose';
import http from 'http';
import cors from 'cors';
import socketio from 'socket.io';
import routes from './routes';

const App = Express();
const Server = http.Server(App);
const io = socketio(Server);

const connected = {};

io.on('connection', socket => {
  const { developer_id } = socket.handshake.query;
  connected[developer_id] = socket.id;
});

Mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

App.use((req, res, next) => {
  req.io = io;
  req.connected = connected;
  return next();
});

App.use(cors());
App.use(Express.json());
App.use(routes);

Server.listen(process.env.PORT);
