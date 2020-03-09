import React from 'react';
import { Router, Switch } from 'react-router-dom';

import Dashboard from '~/pages/Dashboard';
import Details from '~/pages/Details';
import SignIn from '~/pages/SignIn';
import Spot from '~/pages/Spot';
import history from '~/services/history';
import Route from '~/routes/Route';

export default () => (
  <Router history={history}>
    <Switch>
      <Route path="/" exact guest component={SignIn} />

      <Route path="/dashboard" privated component={Dashboard} />
      <Route path="/spots/:id/edit" privated component={Spot} />
      <Route path="/spots/:id" privated component={Details} />
      <Route path="/spot" privated component={Spot} />
    </Switch>
  </Router>
);
