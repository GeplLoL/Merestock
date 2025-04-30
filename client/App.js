// App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './navigation/AppNavigator';

const linking = {
  prefixes: [window.location.origin],  // например http://localhost:8081
  config: {
    screens: {
      Login:      'login',               // http://…/login
      Signup:     'signup',              // http://…/signup
      Home:       'home',                // http://…/home
      Users:      'users',               // http://…/users
      AddListing: 'add-listing',         // http://…/add-listing
      Chat:       'chat/:productId/:otherUserId',
      Profile:    'profile',
    },
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer linking={linking}>
          <AppNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
