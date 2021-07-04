import React from 'react';
import { StatusBar, YellowBox } from 'react-native';

import Navigation from './src';

YellowBox.ignoreWarnings(['Unrecognized WebSocket']);

export default () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7D40E7" />
      <Navigation />
    </>
  );
};
