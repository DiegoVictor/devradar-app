import 'dotenv/config';
import Express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import routes from './routes';

const App = Express();

App.use(cors());
App.use(Express.json());

App.use(routes);

App.use(errors());

export default App;
