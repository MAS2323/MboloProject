import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, Alert, ActivityIndicator} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './styles/ProductDetails.style';
import {COLORS, SIZES} from '../../constants';
import {API_BASE_URL} from '../../config/Service.Config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SCREENS from '../../screens';

// Define named components outside the function
const ProductDetailsMainScreen = ({route}) =>
  route.params?.productContent || null;
const BuyProductScreen = () => null;
const BuyNowScreen = () => null;
const ToggleFavoriteScreen = () => null;

const Tab = createBottomTabNavigator();

const ProductDetailsTabs = ({
  product,
  productContent,
  cartItemsCount,
  setCartItemsCount,
}) => {
  const navigation = useNavigation();
  const isScreenFocused = useIsFocused();
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        if (id) {
          const cleanedUserId = id.replace(/\"/g, '');
          setUserId(cleanedUserId);
        } else {
          setUserId(null);
        }
      } catch (error) {
        console.error('Error retrieving userId:', error);
        setUserId(null);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (userId && product?._id && isScreenFocused) {
      const checkFavoriteStatus = async () => {
        setIsLoadingFavorite(true);
        try {
          console.log(
            `Checking favorite: ${API_BASE_URL}/favorites/check?userId=${userId}&productId=${product._id}`,
          );
          if (!userId || !product?._id) {
            console.warn(
              'Missing userId or productId, skipping favorite check',
            );
            setIsFavorite(false);
            return;
          }
          const response = await axios.get(`${API_BASE_URL}/favorites/check`, {
            params: {userId, productId: product._id},
          });
          setIsFavorite(response.data.isFavorite);
        } catch (error) {
          console.error(
            'Error checking favorite:',
            error.response?.data || error.message,
          );
          setIsFavorite(false); // Default to not favorite on error
        } finally {
          setIsLoadingFavorite(false);
        }
      };
      checkFavoriteStatus();
    } else if (!userId) {
      setIsFavorite(false);
    }
  }, [userId, product?._id, isScreenFocused]);

  const handleAddToCart = useCallback(async () => {
    if (!product?._id) {
      Alert.alert('Error', 'Producto no disponible.');
      return;
    }
    try {
      const cart = await AsyncStorage.getItem('cart');
      let cartItems = cart ? JSON.parse(cart) : [];
      const existingItemIndex = cartItems.findIndex(
        item => item._id === product._id,
      );
      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += 1;
      } else {
        cartItems.push({...product, quantity: 1});
      }
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      setCartItemsCount(cartItems.length);
      Alert.alert('Carrito', 'Producto añadido al carrito');
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      Alert.alert('Error', 'No se pudo añadir el producto al carrito.');
    }
  }, [product, setCartItemsCount]);

  const handleBuyTab = useCallback(async () => {
    await handleAddToCart();
    navigation.navigate(SCREENS.CART);
  }, [handleAddToCart, navigation]);

  const handleBuyNowTab = useCallback(async () => {
    await handleAddToCart();
    navigation.navigate(SCREENS.CART);
  }, [handleAddToCart, navigation]);

  const handleFavoriteTab = useCallback(async () => {
    if (!userId) {
      Alert.alert(
        'Inicia sesión',
        'Debes iniciar sesión para guardar favoritos',
      );
      navigation.navigate(SCREENS.LOGIN);
      return;
    }
    if (!product?._id) {
      Alert.alert('Error', 'Producto no disponible.');
      return;
    }
    if (isLoadingFavorite) return;

    setIsLoadingFavorite(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/favorites/toggle`, {
        userId,
        productId: product._id,
      });
      setIsFavorite(response.data.isFavorite);
      Alert.alert(
        'Favoritos',
        response.data.isFavorite
          ? 'Añadido a favoritos'
          : 'Eliminado de favoritos',
      );
    } catch (error) {
      console.error(
        'Error al gestionar favoritos:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'No se pudo actualizar favoritos.');
    } finally {
      setIsLoadingFavorite(false);
    }
  }, [userId, product, isFavorite, isLoadingFavorite, navigation]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          ...styles.tabBarStyle,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarLabelStyle: {fontSize: 12, fontWeight: '500'},
        tabBarIconStyle: {marginBottom: -3},
        headerShown: false,
      }}>
      <Tab.Screen
        name="ProductDetailsMain"
        children={() => (
          <ProductDetailsMainScreen route={{params: {productContent}}} />
        )}
        initialParams={{productContent}}
        options={{
          tabBarLabel: 'Detalles',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="information-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="BuyProduct"
        children={() => <BuyProductScreen />}
        listeners={{
          tabPress: e => {
            e.preventDefault();
            handleBuyTab();
          },
        }}
        options={{
          tabBarLabel: 'Añadir al Carrito',
          tabBarIcon: ({color, size}) => (
            <View style={styles.tabIconContainer}>
              <MaterialCommunityIcons
                name="cart-outline"
                size={size}
                color={color}
              />
              {cartItemsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItemsCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="BuyNow"
        children={() => <BuyNowScreen />}
        listeners={{
          tabPress: e => {
            e.preventDefault();
            handleBuyNowTab();
          },
        }}
        options={{
          tabBarLabel: 'Comprar Ahora',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="cart-plus"
              size={size}
              color={color}
            />
          ),
        }}
      />
      {product?._id && (
        <Tab.Screen
          name="ToggleFavorite"
          children={() => <ToggleFavoriteScreen />}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              handleFavoriteTab();
            },
          }}
          options={{
            tabBarLabel: 'Favoritos',
            tabBarIcon: ({color, size}) =>
              isLoadingFavorite ? (
                <ActivityIndicator size="small" color={color} />
              ) : (
                <MaterialCommunityIcons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={size}
                  color={color}
                />
              ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default ProductDetailsTabs;
