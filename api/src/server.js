import 'dotenv/config';
import Express from 'express';
import Mongoose from 'mongoose';
import http from 'http';
import cors from 'cors';

import routes from './routes';
import { setupWebSocket } from './websocket';

const App = Express();
const Server = http.Server(App);

setupWebSocket(Server);

Mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

App.use(cors());
App.use(Express.json());
App.use(routes);

Server.listen(process.env.APP_PORT);
