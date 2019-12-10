import './bootstrap';

import Express from 'express';
import http from 'http';
import cors from 'cors';
import socketio from 'socket.io';

import routes from './routes';
import './database';

const App = Express();
const Server = http.Server(App);
const io = socketio(Server);

const connected = {};

io.on('connection', socket => {
  const { developer_id } = socket.handshake.query;
  connected[developer_id] = socket.id;
});

App.use((req, res, next) => {
  req.io = io;
  req.connected = connected;
  return next();
});

App.use(cors());
App.use(Express.json());
App.use(routes);

export default App;