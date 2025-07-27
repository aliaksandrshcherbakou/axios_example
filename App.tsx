import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useCallback} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import WebWrapper from './src/components/WebWrapper';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import AppNavigator from './src/screens';
import AuthNavigator from './src/screens/auth/AuthNavigator';

import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {Provider} from 'react-redux';
import store from 'src/redux/store';

// App Content Component that uses auth context
const AppContent = () => {
  const {user, loading} = useAuth();

  if (loading) {
    // You can add a loading screen component here
    return <View style={styles.flex} />;
  }

  // Show auth screens if user is not authenticated
  if (!user) {
    return <AuthNavigator key="auth-navigator" />;
  }

  // Show main app if user is authenticated
  return <AppNavigator key="main-navigator" />;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Rubik-Regular': require('./assets/fonts/Rubik-Regular.ttf'),
    'Rubik-Bold': require('./assets/fonts/Rubik-Bold.ttf'),
    'Rubik-SemiBold': require('./assets/fonts/Rubik-SemiBold.ttf'),
  });
  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded) {
      // eslint-disable-next-line no-void
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const MainApp = () => (
    <Provider store={store}>
      <AuthProvider>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <AppContent />
        </ApplicationProvider>
      </AuthProvider>
    </Provider>
  );

  return (
    <View style={styles.flex} onLayout={onLayoutRootView}>
      {Platform.OS === 'web' ? (
        <WebWrapper>
          <MainApp />
        </WebWrapper>
      ) : (
        <MainApp />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
});
