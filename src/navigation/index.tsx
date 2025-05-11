// aqui definiremos los stacks de navegacion
import {createStackNavigator} from '@react-navigation/stack';
import IntroScreen from '../screens/intro/IntroScreen';
import SCREENS from '../screens';
import LoginScren from '../screens/auth/LoginScren';

const Stack = createStackNavigator();
const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.INTRO}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={SCREENS.INTRO}
        component={IntroScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.LOGIN}
        component={LoginScren}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
