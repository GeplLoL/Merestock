// src/navigation/AppNavigator.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import AuthNavigator    from './AuthNavigator';
import HomeScreen       from '../screens/HomeScreen';
import UsersScreen      from '../screens/UsersScreen';
import AddListingScreen from '../screens/AddListingScreen';
import ChatScreen       from '../screens/ChatScreen';
import ProfileScreen    from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useSelector(state => state.user.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token
        ? (
          <>
            <Stack.Screen name="Home"       component={HomeScreen} />
            <Stack.Screen name="Users"      component={UsersScreen} />
            <Stack.Screen name="AddListing" component={AddListingScreen} />
            <Stack.Screen name="Chat"       component={ChatScreen} />
            <Stack.Screen name="Profile"    component={ProfileScreen} />
          </>
        )
        : <Stack.Screen name="Auth" component={AuthNavigator} />
      }
    </Stack.Navigator>
  );
}
