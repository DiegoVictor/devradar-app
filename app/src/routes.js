import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Book from '~/components/pages/Book';
import Bookings from '~/components/pages/Bookings';
import List from '~/components/pages/List';
import SignIn from '~/components/pages/SignIn';

export default createAppContainer(
  createSwitchNavigator({
    SignIn,
    App: createBottomTabNavigator(
      {
        Spots: {
          screen: createSwitchNavigator({
            List,
            Book,
          }),
          navigationOptions: () => ({
            tabBarLabel: 'Spots',
            // eslint-disable-next-line react/prop-types
            tabBarIcon: ({ tintColor }) => (
              <Icon name="place" size={20} color={tintColor} />
            ),
          }),
        },
        Bookings: {
          screen: Bookings,
          navigationOptions: () => ({
            tabBarLabel: 'Bookings',
            // eslint-disable-next-line react/prop-types
            tabBarIcon: ({ tintColor }) => (
              <Icon name="date-range" size={20} color={tintColor} />
            ),
          }),
        },
      },
      {
        tabBarOptions: {
          keyboardHidesTabBar: true,
          activeTintColor: '#FFF',
          inactiveTintColor: 'rgba(255, 255, 255, 0.6)',
          style: {
            backgroundColor: '#f05a5b',
            border: 0,
            borderTopColor: '#f05a5b',
            fontSize: 13,
            lineHeight: 14,
            paddingBottom: 5,
            paddingTop: 10,
          },
        },
      }
    ),
  })
);
