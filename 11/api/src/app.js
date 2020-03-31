import 'dotenv/config';
import Express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import helmet from 'helmet';

import routes from './routes';
import RouteAliases from './app/middlewares/RouteAliases';

const App = Express();

App.use(helmet());
App.use(cors());
App.use(Express.json());
App.use(RouteAliases);

App.use('/v1/', routes);

App.use(errors());

export default App;
