import React from 'react';
import { StatusBar } from 'react-native';

import Navigation from './src';


export default () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7D40E7" />
      <Navigation />
    </>
  );
};
