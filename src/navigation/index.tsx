// aqui definiremos los stacks de navegacion
import {createStackNavigator} from '@react-navigation/stack';
import IntroScreen from '../screens/intro/IntroScreen';
import SCREENS from '../screens';
import LoginScren from '../screens/auth/LoginScren';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/tabs/HomeScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';
import FavoriteScreen from '../screens/tabs/FavoriteScreen';
import AllStoreScreen from '../screens/tabs/AllStoreScreen';
import {Image} from 'react-native';
import IMAGES from '../assets/images';
import {COLORS} from '../constants';
import SearchScreen from '../components/header/SearchScreen';
import ProductList from '../components/products/ProductList';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
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
      <Stack.Screen
        name={SCREENS.PRODUCT_LIST}
        component={ProductList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.SEATCHSCRENN}
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.HOME_STACK}
        component={MyTabs}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

function MyTabs() {
  return (
    <Tab.Navigator initialRouteName={SCREENS.HOME}>
      <Tab.Screen
        name={SCREENS.HOME}
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Image
              source={IMAGES.HOME}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? COLORS.primary : COLORS.GRAY_LIGHT,
              }}
            />
          ),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.GRAY_LIGHT,
        }}
      />
      <Tab.Screen
        name={SCREENS.ALLSTORE}
        component={AllStoreScreen}
        options={{
          title: 'All Store',
          tabBarIcon: ({focused}) => (
            <Image
              source={IMAGES.ORDERS}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? COLORS.primary : COLORS.GRAY_LIGHT,
              }}
            />
          ),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.GRAY_LIGHT,
        }}
      />
      <Tab.Screen
        name={SCREENS.FAVORITE}
        component={FavoriteScreen}
        options={{
          title: 'Favorite',
          tabBarIcon: ({focused}) => (
            <Image
              source={IMAGES.WISHLIST}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? COLORS.primary : COLORS.GRAY_LIGHT,
              }}
            />
          ),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.GRAY_LIGHT,
        }}
      />

      <Tab.Screen
        name={SCREENS.PROFILE}
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({focused}) => (
            <Image
              source={IMAGES.PROFILE}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? COLORS.primary : COLORS.GRAY_LIGHT,
              }}
            />
          ),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.GRAY_LIGHT,
        }}
      />
    </Tab.Navigator>
  );
}
export default StackNavigation;
