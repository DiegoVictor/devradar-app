import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

import Login from '~/components/pages/Login';
import Main from '~/components/pages/Main';
import Matches from '~/components/pages/Matches';

export default createAppContainer(
  createSwitchNavigator({
    Login,
    App: createDrawerNavigator(
      {
        Main,
        Matches,
      },
      {
        drawerType: 'back',
        contentOptions: {
          activeBackgroundColor: '#df4723',
          activeTintColor: '#FFF',
          labelStyle: {
            fontSize: 13,
            fontWeight: 'bold',
            textTransform: 'uppercase',
          },
        },
      }
    ),
  })
);
