import React from 'react';
import { YellowBox } from 'react-native';

import '~/config/ReactotronConfig';
import Routes from '~/routes';

YellowBox.ignoreWarnings(['Unrecognized WebSocket']);

export default () => {
  return <Routes />;
};
