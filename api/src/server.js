import 'dotenv/config';
import Express from 'express';
import Mongoose from 'mongoose';

import routes from './routes';

const App = Express();

Mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

App.use(Express.json());
App.use(routes);

App.listen(process.env.APP_PORT);
