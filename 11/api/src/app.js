import 'dotenv/config';
import Express from 'express';

import routes from './routes';

const App = Express();
App.use(Express.json());

App.use(routes);

export default App;
