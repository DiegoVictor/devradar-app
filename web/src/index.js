import React from 'react';
import ReactDOM from 'react-dom';
import Default from './pages';
import Style from './styles';
import Routes from './routes';

ReactDOM.render(
  <>
    <Style />
    <Default>
      <Routes />
    </Default>
  </>,
  document.getElementById('root')
);
