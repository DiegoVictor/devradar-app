// eslint-disable-next-line import/no-extraneous-dependencies
import Reactotron from 'reactotron-react-js';

if (process.env.NODE_ENV === 'development') {
  const tron = Reactotron.configure().connect();
  tron.clear();
}
