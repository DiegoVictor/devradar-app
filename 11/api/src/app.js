import 'dotenv/config';
import Express from 'express';
const App = Express();
App.use(Express.json());

export default App;
