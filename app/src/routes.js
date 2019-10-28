import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Book from '~/components/pages/Book';
import List from '~/components/pages/List';
import SignIn from '~/components/pages/SignIn';

export default createAppContainer(
  createSwitchNavigator({
    SignIn,
    Book,
    List,
  })
);
