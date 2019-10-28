import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import SignIn from '~/pages/SignIn';
import Dashboard from '~/pages/Dashboard';
import Spot from '~/pages/Spot';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/spot" exact component={Spot} />
    </Switch>
  </BrowserRouter>
);
