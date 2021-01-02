import { StatusBar } from 'expo-status-bar';
import React from 'react';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';
import store from './src/store';
  import { LogBox } from 'react-native';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  // Ignore log notification by message:
  LogBox.ignoreLogs(['The global "__expo" and "Expo" objects will be removed in SDK 41. Learn more about how to fix this warning: https://expo.fyi/deprecated-globals']);
  //console.disableYellowBox = true;

  // Ignore all log notifications:
  LogBox.ignoreAllLogs();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store = {store}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />

          <FlashMessage position="top" />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
