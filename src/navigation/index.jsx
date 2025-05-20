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
import SearchScreen from '../components/header/Search/SearchScreen';
import ProductList from '../components/products/ProductList';
import ProductDetails from '../components/products/ProductDetails';
import ImageGalleryScreen from '../components/products/components/ImageGalleryScreen';
import MiTiendaScreen from '../components/stores/MiTiendaScreen';
import CategoryMenuScreen from '../components/menu/categorias/CategoryMenuScreen';
import SubCategoryMenuScreen from '../components/menu/categorias/SubCategoryMenuScreen';
import MenuItemDetails from '../components/menu/categorias/MenuItemDetails';
import ProducListCategory from '../components/products/categorias/ProducListCategory';
import DetallesScreen from '../components/tendencia/DetallesScreen';
import tendenciaGalleryScreen from '../components/tendencia/tendenciaGalleryScreen';
import TiendaDetalle from '../components/stores/TiendaDetalle';
import AppCenter from '../components/stores/AppCenter';
import MiniAppWebView from '../components/browser/MiniAppWebView';
import RegisterScreen from '../screens/auth/RegisterScreen';

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
        name={SCREENS.IMAGE_GALLERY_SCREEN}
        component={ImageGalleryScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.CATEGORY_MENU_SCREEN}
        component={CategoryMenuScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.SUB_CATEGORY_MENU_SCREEN}
        component={SubCategoryMenuScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.MENU_ITEM_DETAILS}
        component={MenuItemDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.PRODUCT_DETAIL}
        component={ProductDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.PRODUCT_LIST_CATEGORY}
        component={ProducListCategory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.SEARCHSCREEN}
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.DETALLE_SCREEN}
        component={DetallesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.TENDENCIAS_SCREEN_GALERY}
        component={tendenciaGalleryScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.TIENDA_DETALLE_SCREEN}
        component={TiendaDetalle}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.REGISTER}
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.APP_CENTER}
        component={AppCenter}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.MINI_APP_WEB_VIEWER}
        component={MiniAppWebView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.PRODUCT_LIST}
        component={ProductList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.MY_STORE}
        component={MiTiendaScreen}
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
