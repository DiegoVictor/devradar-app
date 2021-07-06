import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from '~/pages/Main';
import Profile from '~/pages/Profile';

const Stack = createStackNavigator();

export default () => (
  <NavigationContainer>
    <Stack.Navigator
      defaultNavigationOptions={{
        headerBackTitleVisible: false,
        headerTintColor: '#FFF',
        headerStyle: {
          backgroundColor: '#7D40E7',
        },
      }}
    >
      <Stack.Screen
        name="DevRadar"
        component={Main}
        options={{
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#7D40E7',
          },
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#7D40E7',
          },
          headerTitle: 'Perfil do Github',
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
