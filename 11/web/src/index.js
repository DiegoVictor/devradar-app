import React from 'react';
import ReactDOM from 'react-dom';

import '~/config/ReactotronConfig';
import Navigation from './routes';

ReactDOM.render(
  <React.StrictMode>
    <Navigation />
  </React.StrictMode>,
  document.getElementById('root')
);
