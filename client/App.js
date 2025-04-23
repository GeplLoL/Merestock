import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './navigation/AppNavigator';
import { store } from './redux/store';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <PaperProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
          <StatusBar style="auto" />
        </PaperProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
}
