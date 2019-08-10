const Express = require('express');
const App = Express();
const Mongoose = require('mongoose');
const CORS = require('cors');
const Server = require('http').Server(App);
const SocketIo = require('socket.io')(Server);

const { port } = require('./config/app');
const { host, name, username, password } = require('./config/database');

const connected = {};

SocketIo.on('connection', socket => {
  const { developer_id } = socket.handshake.query;
  connected[developer_id] = socket.id;
  
});

Mongoose.connect(
  `mongodb+srv://${username}:${password}@${host}/${name}?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

App.use((req, res, next) => {
  req.io = SocketIo;
  req.connected = connected;
  return next();
});

App.use(CORS());
App.use(Express.json());
App.use(require('./routes/main'));

Server.listen(port);