import React, {useState, useEffect, useCallback} from 'react';
import {Alert, ActivityIndicator} from 'react-native'; // Import ActivityIndicator
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation, useIsFocused} from '@react-navigation/native'; // useIsFocused para actualizar estado si es necesario
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './styles/ProductDetails.style'; // Asumiendo que tienes tabBarStyle aquí
import {COLORS, API_BASE_URL, SIZES} from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SCREENS from '../../screens';

const Tab = createBottomTabNavigator();

const ProductDetailsTabs = ({product, productContent}) => {
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
          setUserId(null); // Asegurar que userId sea null si no se encuentra
        }
      } catch (error) {
        console.error('Error retrieving userId:', error);
        setUserId(null);
      }
    };
    loadInitialData();
  }, []); // Cargar userId solo una vez

  useEffect(() => {
    // Solo verificar favoritos si tenemos userId, producto, subcategoría y la pantalla está enfocada
    if (userId && product?.subcategory?._id && isScreenFocused) {
      const checkFavoriteStatus = async () => {
        setIsLoadingFavorite(true);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/favorites/${userId}`, // Asumo que este endpoint devuelve todos los favoritos del user
          );
          const favoritesData =
            response.data?.subcategories || response.data || []; // Adaptar según la respuesta de tu API
          setIsFavorite(
            favoritesData.some(fav => fav._id === product.subcategory._id),
          );
        } catch (error) {
          console.error(
            'Error checking favorite status:',
            error.response?.data || error.message,
          );
          // No cambiar isFavorite en caso de error, podría ser un problema de red temporal
        } finally {
          setIsLoadingFavorite(false);
        }
      };
      checkFavoriteStatus();
    } else if (!userId) {
      setIsFavorite(false); // Si no hay userId, no puede ser favorito
    }
  }, [userId, product?.subcategory?._id, isScreenFocused, product?._id]); // product._id para reaccionar si el producto entero cambia

  const handleBuyTab = useCallback(async () => {
    if (!product?._id) {
      Alert.alert('Error', 'Producto no disponible.');
      return;
    }
    try {
      const cart = await AsyncStorage.getItem('cart');
      let cartItems = cart ? JSON.parse(cart) : [];
      if (!cartItems.find(item => item._id === product._id)) {
        cartItems.push({...product, quantity: 1});
        await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
        Alert.alert('Carrito', 'Producto añadido al carrito');
      } else {
        Alert.alert('Carrito', 'El producto ya está en el carrito');
      }
      navigation.navigate(SCREENS.CART_SCREEN /*, { product } - opcional */);
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      Alert.alert('Error', 'No se pudo añadir el producto al carrito.');
    }
  }, [product, navigation]);

  const handleFavoriteTab = useCallback(async () => {
    if (!userId) {
      Alert.alert('Error', 'Usuario no autenticado. Por favor, inicia sesión.');
      return;
    }
    if (!product?.subcategory?._id) {
      Alert.alert('Error', 'Subcategoría no disponible para este producto.');
      return;
    }
    if (isLoadingFavorite) return; // Evitar múltiples clicks

    setIsLoadingFavorite(true);
    const subcategoryId = product.subcategory._id;
    const newFavoriteState = !isFavorite;

    try {
      if (newFavoriteState) {
        await axios.post(`${API_BASE_URL}/favorites`, {userId, subcategoryId});
        Alert.alert('Favoritos', 'Añadido a favoritos');
      } else {
        await axios.delete(
          `${API_BASE_URL}/favorites/${userId}/${subcategoryId}`,
        );
        Alert.alert('Favoritos', 'Eliminado de favoritos');
      }
      setIsFavorite(newFavoriteState);
      // navigation.navigate(SCREENS.FAVORITE); // Considerar si esta navegación es siempre necesaria
    } catch (error) {
      console.error(
        'Error al gestionar favoritos:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'No se pudo actualizar favoritos.');
      // No revertir aquí el estado de isFavorite, la UI se actualizará en el próximo check si es necesario
    } finally {
      setIsLoadingFavorite(false);
    }
  }, [userId, product, isFavorite, isLoadingFavorite, navigation]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBarStyle || {
          // Proporcionar un fallback o asegurar que styles.tabBarStyle exista
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
          paddingBottom: SIZES.bottomTabBarPadding || 5, // Usar constante
          height: SIZES.tabBarHeight || 60, // Usar constante
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: false,
      }}>
      <Tab.Screen
        name="ProductDetailsMain" // Renombrar para evitar conflictos
        children={() => productContent}
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
        name="BuyProduct" // Renombrar
        component={() => null} // Es una acción, no una pantalla
        listeners={{
          tabPress: e => {
            e.preventDefault();
            handleBuyTab();
          },
        }}
        options={{
          tabBarLabel: 'Comprar',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="cart-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      {/* Solo mostrar tab de favoritos si el producto tiene subcategoría */}
      {product?.subcategory?._id && (
        <Tab.Screen
          name="ToggleFavorite" // Renombrar
          component={() => null} // Es una acción
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
