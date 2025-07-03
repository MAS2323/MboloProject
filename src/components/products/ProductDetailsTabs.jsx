import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './styles/ProductDetailsTabs';
import {COLORS, SIZES} from '../../constants';
import {API_BASE_URL} from '../../config/Service.Config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SCREENS from '../../screens';

// Constants for better maintainability
const STORAGE_KEYS = {
  USER_ID: 'id',
  CART: 'cart',
};

const API_ENDPOINTS = {
  FAVORITES_CHECK: '/favorites/check',
  FAVORITES_TOGGLE: '/favorites/toggle',
};

const MESSAGES = {
  ERRORS: {
    INVALID_USER_ID:
      'ID de usuario no válido. Por favor, inicia sesión nuevamente.',
    PRODUCT_NOT_AVAILABLE: 'Producto no disponible.',
    CART_ADD_ERROR: 'No se pudo añadir el producto al carrito.',
    FAVORITES_ERROR: 'No se pudo actualizar favoritos.',
    INVALID_PRODUCT: 'Producto no válido.',
  },
  SUCCESS: {
    CART_ADDED: 'Producto añadido al carrito',
  },
  INFO: {
    LOGIN_REQUIRED: 'Debes iniciar sesión para guardar favoritos o comprar',
  },
};

// Utility to validate MongoDB ObjectId
const isValidObjectId = id => /^[0-9a-fA-F]{24}$/.test(id);

// Custom hook for cart management
const useCart = () => {
  const addToCart = useCallback(async product => {
    try {
      const cart = await AsyncStorage.getItem(STORAGE_KEYS.CART);
      let cartItems = cart ? JSON.parse(cart) : [];

      const existingItemIndex = cartItems.findIndex(
        item => item._id === product._id,
      );

      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += 1;
      } else {
        cartItems.push({...product, quantity: 1});
      }

      await AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
      return cartItems.length;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }, []);

  return {addToCart};
};

// Custom hook for favorites management
const useFavorites = (userId, productId) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkFavoriteStatus = useCallback(async () => {
    if (!userId || !productId) return;

    setIsLoading(true);
    try {
      if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
        console.warn('Invalid userId or productId:', {userId, productId});
        setIsFavorite(false);
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FAVORITES_CHECK}`,
        {
          params: {userId, productId},
          timeout: 5000,
        },
      );

      setIsFavorite(response.data.isFavorite || false);
    } catch (error) {
      console.error('Error checking favorite:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setIsFavorite(false);
    } finally {
      setIsLoading(false);
    }
  }, [userId, productId]);

  const toggleFavorite = useCallback(async () => {
    if (!userId || !productId) return false;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.FAVORITES_TOGGLE}`,
        {userId, productId},
        {timeout: 5000},
      );

      setIsFavorite(response.data.isFavorite);
      return {
        success: true,
        message: response.data.message,
        isFavorite: response.data.isFavorite,
      };
    } catch (error) {
      console.error('Error toggling favorite:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return {
        success: false,
        message: MESSAGES.ERRORS.FAVORITES_ERROR,
      };
    } finally {
      setIsLoading(false);
    }
  }, [userId, productId]);

  return {isFavorite, isLoading, checkFavoriteStatus, toggleFavorite};
};

const ProductDetailsTabs = ({
  product,
  productContent,
  cartItemsCount,
  setCartItemsCount,
}) => {
  const navigation = useNavigation();
  const isScreenFocused = useIsFocused();
  const [userId, setUserId] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Animations for visual feedback
  const scaleAnim = useMemo(() => new Animated.Value(1), []);
  const fadeAnim = useMemo(() => new Animated.Value(1), []);

  // Custom hooks
  const {addToCart} = useCart();
  const {
    isFavorite,
    isLoading: isLoadingFavorite,
    checkFavoriteStatus,
    toggleFavorite,
  } = useFavorites(userId, product?._id);

  // Function to clean userId from storage
  const cleanUserId = useCallback(id => id?.replace(/"/g, ''), []);

  // Load initial user data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const id = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
        if (id) {
          const cleanedUserId = cleanUserId(id);
          if (isValidObjectId(cleanedUserId)) {
            setUserId(cleanedUserId);
          } else {
            console.error('Invalid userId from AsyncStorage:', cleanedUserId);
            Alert.alert('Error', MESSAGES.ERRORS.INVALID_USER_ID);
            setUserId(null);
          }
        } else {
          setUserId(null);
        }
      } catch (error) {
        console.error('Error retrieving userId:', error);
        setUserId(null);
      }
    };

    loadInitialData();
  }, [cleanUserId]);

  // Check favorite status when the screen is focused
  useEffect(() => {
    if (userId && product?._id && isScreenFocused) {
      checkFavoriteStatus();
    }
  }, [userId, product?._id, isScreenFocused, checkFavoriteStatus]);

  // Pulse animation for visual feedback
  const animatePulse = useCallback(
    callback => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(callback);
    },
    [scaleAnim],
  );

  // Handler for adding to cart
  const handleAddToCart = useCallback(async () => {
    if (!product?._id || !isValidObjectId(product._id)) {
      Alert.alert('Error', MESSAGES.ERRORS.PRODUCT_NOT_AVAILABLE);
      return;
    }

    if (isAddingToCart) return;

    setIsAddingToCart(true);
    animatePulse();

    try {
      const newCartCount = await addToCart(product);
      setCartItemsCount(newCartCount);
      Alert.alert('Carrito', MESSAGES.SUCCESS.CART_ADDED);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', MESSAGES.ERRORS.CART_ADD_ERROR);
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, setCartItemsCount, addToCart, animatePulse]);

  // Handler for initiating purchase
  const handleBuyNow = useCallback(() => {
    if (!userId) {
      Alert.alert('Inicia sesión', MESSAGES.INFO.LOGIN_REQUIRED, [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Iniciar sesión',
          onPress: () => navigation.navigate(SCREENS.LOGIN),
        },
      ]);
      return;
    }
    if (!product?._id || !isValidObjectId(product._id)) {
      Alert.alert('Error', MESSAGES.ERRORS.INVALID_PRODUCT);
      return;
    }

    navigation.navigate(SCREENS.ORDER_PROCESSING, {
      product,
      userId,
    });
  }, [userId, product, navigation]);

  // Handler for toggling favorite
  const handleToggleFavorite = useCallback(async () => {
    if (!userId) {
      Alert.alert('Inicia sesión', MESSAGES.INFO.LOGIN_REQUIRED, [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Iniciar sesión',
          onPress: () => navigation.navigate(SCREENS.LOGIN),
        },
      ]);
      return;
    }

    if (!product?._id || !isValidObjectId(product._id)) {
      Alert.alert('Error', MESSAGES.ERRORS.INVALID_PRODUCT);
      return;
    }

    if (isLoadingFavorite) return;

    const result = await toggleFavorite();
    if (result.success) {
      Alert.alert('Favoritos', result.message);
    } else {
      Alert.alert('Error', result.message);
    }
  }, [userId, product, isLoadingFavorite, toggleFavorite, navigation]);

  // Render favorite button
  const renderFavoriteButton = () => (
    <TouchableOpacity
      style={[styles.favoriteButton, isLoadingFavorite && styles.loadingButton]}
      onPress={handleToggleFavorite}
      disabled={isLoadingFavorite}
      activeOpacity={0.7}>
      {isLoadingFavorite ? (
        <ActivityIndicator size="small" color={COLORS.dark} />
      ) : (
        <MaterialCommunityIcons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={isFavorite ? COLORS.red || '#FF0000' : COLORS.dark}
        />
      )}
    </TouchableOpacity>
  );

  // Render cart icon button
  const renderCartIconButton = () => (
    <TouchableOpacity
      style={[styles.cartIconButton, isAddingToCart && styles.loadingButton]}
      onPress={handleAddToCart}
      disabled={isAddingToCart}
      activeOpacity={0.7}>
      <View style={styles.tabIconContainer}>
        {isAddingToCart ? (
          <ActivityIndicator size="small" color={COLORS.dark} />
        ) : (
          <MaterialCommunityIcons
            name="cart-outline"
            size={24}
            color={COLORS.dark}
          />
        )}
        {cartItemsCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {cartItemsCount > 99 ? '99+' : cartItemsCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render cart text button
  const renderCartTextButton = () => (
    <TouchableOpacity
      style={[styles.cartTextButton, isAddingToCart && styles.disabledButton]}
      onPress={handleAddToCart}
      disabled={isAddingToCart}
      activeOpacity={0.7}>
      <Text style={styles.cartButtonText}>
        {isAddingToCart ? 'AÑADIENDO...' : 'AL CARRITO'}
      </Text>
    </TouchableOpacity>
  );

  // Render buy button
  const renderBuyButton = () => (
    <TouchableOpacity
      style={[styles.buyButton, isAddingToCart && styles.disabledButton]}
      onPress={handleBuyNow}
      disabled={isAddingToCart}
      activeOpacity={0.7}>
      <Text style={styles.buyButtonText}>COMPRAR</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Main product content */}
      <View style={styles.contentContainer}>{productContent}</View>

      {/* Bottom action bar */}
      <Animated.View
        style={[
          styles.actionBar,
          {
            transform: [{scale: scaleAnim}],
            opacity: fadeAnim,
          },
        ]}>
        {renderFavoriteButton()}
        {renderCartIconButton()}
        {renderCartTextButton()}
        {renderBuyButton()}
      </Animated.View>
    </View>
  );
};

export default ProductDetailsTabs;
