import React from 'react';
import { Router } from 'react-router-dom';

import Login from '~/pages/Login';
import Main from '~/pages/Main';
import Matches from '~/pages/Matches';
import history from '~/services/history';
import Route from '~/routes/Route';

export default () => {
  return (
    <Router history={history}>
      <Route path="/" guest component={Login} />

      <Route path="/developers" exact privated component={Main} />
      <Route path="/matches" privated component={Matches} />
    </Router>
  );
};
