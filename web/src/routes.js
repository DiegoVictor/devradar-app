import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from '~/components/pages/Login';
import Main from '~/components/pages/Main';
import Matches from './components/pages/Matches';

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/developers/:id" component={Main} />
      <Route path="/matches" component={Matches} />
    </BrowserRouter>
  );
}
