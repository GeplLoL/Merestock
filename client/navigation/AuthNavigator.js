import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector }               from 'react-redux';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen  from '../screens/HomeScreen';
import LogoutButton from '../components/LogoutButton';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useSelector(state => state.user.token);

  return (
    <Stack.Navigator>
      {!token ? (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
      ) : (
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Главная',
            headerRight: () => <LogoutButton />
          }}
        />
      )}
    </Stack.Navigator>
  );
}
