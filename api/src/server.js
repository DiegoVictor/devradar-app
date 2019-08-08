const Express = require('express');
const Server = Express();
const Mongoose = require('mongoose');
const CORS = require('cors');

const { PORT } = require('./config/app');
const { host, name, username, password } = require('./config/database');

Mongoose.connect(
  `mongodb+srv://${username}:${password}@${host}/${name}?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

Server.use(CORS());
Server.use(Express.json());
Server.use(require('./routes/main'));

Server.listen(PORT);