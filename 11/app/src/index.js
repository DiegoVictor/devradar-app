import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Detail from '~/pages/Detail';
import Incidents from '~/pages/Incidents';

const StackNavigator = createStackNavigator();

export default () => (
  <NavigationContainer>
    <StackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <StackNavigator.Screen name="Incidents" component={Incidents} />
      <StackNavigator.Screen name="Detail" component={Detail} />
    </StackNavigator.Navigator>
  </NavigationContainer>
);
