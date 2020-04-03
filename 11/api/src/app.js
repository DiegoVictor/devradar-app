import 'dotenv/config';
import 'express-async-errors';

import Express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import helmet from 'helmet';
import { isBoom } from '@hapi/boom';

import routes from './routes';
import RouteAliases from './app/middlewares/RouteAliases';

const App = Express();

App.use(helmet());
App.use(cors());
App.use(Express.json());
App.use(RouteAliases);

App.use('/v1/', routes);

App.use(errors());
App.use((err, _, res, next) => {
  if (isBoom(err)) {
    const { statusCode, payload } = err.output;

    return res.status(statusCode).json({
      ...payload,
      ...err.data,
      docs: process.env.DOCS_URL,
    });
  }

  return next(err);
});

export default App;
