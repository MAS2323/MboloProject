import {Platform, StyleSheet} from 'react-native';
import {useEffect} from 'react';
// import SplashScreen from 'react-native-splash-screen';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import StackNavigation from './src/navigation';
// import configureNotifications from './src/config/NotificationService';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
  },
};

const App = () => {
  // useEffect(() => {
  //   // Add a small delay to ensure native modules are ready
  //   const timer = setTimeout(() => {
  //     configureNotifications();
  //   }, 1000); // 1-second delay

  //   // Cleanup the timer on unmount
  //   return () => clearTimeout(timer);
  // }, []);

  // Uncomment and use if you have a splash screen
  // useEffect(() => {
  //   if (Platform.OS === 'android') SplashScreen.hide();
  // }, []);

  return (
    <NavigationContainer theme={MyTheme}>
      <StackNavigation />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
