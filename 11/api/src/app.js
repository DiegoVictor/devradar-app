import 'dotenv/config';
import Express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import helmet from 'helmet';

import routes from './routes';
import ResourceUrl from './app/middlewares/ResourceUrl';

const App = Express();

App.use(helmet());
App.use(cors());
App.use(Express.json());

App.use(ResourceUrl);

App.use(routes);

App.use(errors());

export default App;
