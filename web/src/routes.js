import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from "./components/pages/Login/Login";
import Main from "./components/pages/Main/Main";

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/developers/:id" component={Main} />
    </BrowserRouter>
  );
}