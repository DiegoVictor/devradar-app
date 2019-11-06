import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Login from '~/components/pages/Login';
import Main from '~/components/pages/Main';

export default createAppContainer(createSwitchNavigator({
  Login,
  Main
}));