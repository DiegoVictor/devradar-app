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

SocketIo.on('connection', socket => {
  const { developer_id } = socket.handshake.query;
  connected[developer_id] = socket.id;
  
Mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

App.use((req, res, next) => {
  req.io = SocketIo;
  req.connected = connected;
  return next();
});

App.use(CORS());
App.use(Express.json());
Server.listen(process.env.PORT);
