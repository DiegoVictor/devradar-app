import Reactotron from 'reactotron-react-js';

if (process.env.NODE_ENV === 'development') {
  Reactotron.configure().connect();
}
