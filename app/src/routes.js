/* eslint-disable react/prop-types */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Book from '~/pages/Book';
import Bookings from '~/pages/Bookings';
import List from '~/pages/List';
import SignIn from '~/pages/SignIn';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default () => {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="App">
          {() => {
            return (
              <Tab.Navigator
                tabBarOptions={{
                  keyboardHidesTabBar: true,
                  activeTintColor: '#FFF',
                  inactiveTintColor: 'rgba(255, 255, 255, 0.6)',
                  style: {
                    backgroundColor: '#f05a5b',
                    border: 0,
                    borderTopColor: '#e0494a',
                    fontSize: 13,
                    lineHeight: 14,
                    paddingBottom: 5,
                    paddingTop: 10,
                  },
                }}
              >
                <Tab.Screen
                  name="Spots"
                  options={{
                    tabBarIcon: ({ color }) => (
                      <Icon name="place" size={20} color={color} />
                    ),
                  }}
                >
                  {() => {
                    return (
                      <Stack.Navigator headerMode="none">
                        <Stack.Screen name="List" component={List} />
                        <Stack.Screen name="Book" component={Book} />
                      </Stack.Navigator>
                    );
                  }}
                </Tab.Screen>
                <Tab.Screen
                  name="Bookings"
                  options={{
                    tabBarIcon: ({ color }) => (
                      <Icon name="date-range" size={20} color={color} />
                    ),
                  }}
                  component={Bookings}
                />
              </Tab.Navigator>
            );
          }}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
