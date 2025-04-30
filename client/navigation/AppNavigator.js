import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector }               from 'react-redux';
import LoginScreen                    from '../screens/LoginScreen';
import SignupScreen                   from '../screens/SignupScreen';
import HomeScreen                     from '../screens/HomeScreen';
import AddListingScreen               from '../screens/AddListingScreen';
import HeaderLogout                   from '../components/HeaderLogout';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useSelector(s => s.user.token);

  return (
    <Stack.Navigator>
      {!token ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: 'Kuulutused',                // Kuulutused
              headerTitleAlign: 'center',
              headerRight: () => <HeaderLogout navigation={navigation} />,
            })}
          />
          <Stack.Screen
            name="AddListing"
            component={AddListingScreen}
            options={({ navigation }) => ({
              title: 'Uus kuulutus',             // Uus kuulutus
              headerTitleAlign: 'center',
              headerRight: () => <HeaderLogout navigation={navigation} />,
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
