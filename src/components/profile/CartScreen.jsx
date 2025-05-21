import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  Linking,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import {getCachedData, setCachedData} from '../cache/Cache';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../../config/Service.Config';
import {useNavigation} from '@react-navigation/native';
import styles from './styles/CartScreenStyle';
import IMAGES from '../../assets/images';
import SCREENS from '../../screens';
// ======================================================
// Main Component
// ======================================================
const CartScreen = () => {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Replaced useRouter with useNavigation

  // ======================================================
  // User ID Functions
  // ======================================================
  const fetchUserId = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      setUserId(id ? id.replace(/\"/g, '') : null);
    } catch (error) {
      console.error('Error retrieving userId:', error);
      setUserId(null);
    }
  }, []);

  // ======================================================
  // Cart Functions
  // ======================================================
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      if (!userId) return;

      // Check cached data first
      const cachedCart = await getCachedData(`cart_${userId}`);
      if (cachedCart) {
        setCart(cachedCart);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);

      if (response.status === 200) {
        const cartData = response.data;
        setCart(cartData);
        setCachedData(`cart_${userId}`, cartData);
      } else {
        console.error('Failed to fetch cart, status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleRemoveItem = async cartItemId => {
    try {
      Alert.alert(
        'Eliminar producto',
        '¿Estás seguro de que quieres eliminar este producto del carrito?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Eliminar',
            onPress: async () => {
              await axios.delete(
                `${API_BASE_URL}/cart/${userId}/${cartItemId}`,
              );

              const updatedCartProducts = cart.products.filter(
                item => item._id !== cartItemId,
              );
              const updatedCart = {...cart, products: updatedCartProducts};

              setCart(updatedCart);
              setCachedData(`cart_${userId}`, updatedCart);

              Alert.alert(
                'Producto eliminado',
                'El artículo ha sido eliminado del carrito.',
              );
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error al eliminar el artículo del carrito:', error);
      Alert.alert('Error', 'No se pudo eliminar el producto del carrito');
    }
  };

  // ======================================================
  // Utility Functions
  // ======================================================
  const handleWhatsApp = phoneNumber => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Número de WhatsApp no disponible');
      return;
    }
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCart();
    setRefreshing(false);
  }, [fetchCart]);

  // ======================================================
  // Effects
  // ======================================================
  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId, fetchCart]);

  // ======================================================
  // Loading State
  // ======================================================
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c86A8" />
        <Text style={styles.loadingText}>Cargando tu carrito...</Text>
      </SafeAreaView>
    );
  }

  // ======================================================
  // Main Render
  // ======================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4c86A8']}
            tintColor="#4c86A8"
          />
        }>
        {cart?.products?.length === 0 ? (
          // ======================================================
          // Empty Cart State
          // ======================================================
          <View style={styles.emptyContainer}>
            <Image
              source={IMAGES.CARITO}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
            <Text style={styles.emptyText}>
              Añade productos para verlos aquí
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate(SCREENS.PRODUCT_LIST)} // Updated navigation
            >
              <FontAwesome name="shopping-cart" size={20} color="white" />
              <Text style={styles.addButtonText}>Explorar productos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              Tus productos ({cart?.products?.length || 0})
            </Text>

            {/* ======================================================
                Product List
            ====================================================== */}
            {cart?.products?.map(product => (
              <View key={product._id}>
                <View style={styles.card}>
                  {product.images?.[0]?.url ? (
                    <Image
                      source={{uri: product.images[0].url}}
                      style={styles.image}
                      onError={e =>
                        console.error(
                          'Error loading image:',
                          e.nativeEvent.error,
                        )
                      }
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <MaterialIcons
                        name="image-not-supported"
                        size={40}
                        color="#ccc"
                      />
                    </View>
                  )}
                  <View style={styles.infoContainer}>
                    <Text style={styles.title} numberOfLines={2}>
                      {product.title}
                    </Text>
                    <Text style={styles.supplier} numberOfLines={1}>
                      {product.supplier || 'Proveedor no disponible'}
                    </Text>
                    <Text style={styles.price}>
                      XAF {product.price?.toLocaleString() || '0'}
                    </Text>

                    <View style={styles.actionContainer}>
                      <TouchableOpacity
                        style={styles.whatsappButton}
                        onPress={() => handleWhatsApp(product.whatsapp)}>
                        <FontAwesome name="whatsapp" size={16} color="white" />
                        <Text style={styles.whatsappText}> Contactar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRemoveItem(product._id)}
                        style={styles.deleteButton}>
                        <MaterialIcons
                          name="delete-outline"
                          size={24}
                          color="#ff4444"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.separator} />
              </View>
            ))}
          </>
        )}

        {/* ======================================================
            Checkout Button
        ====================================================== */}
        {cart?.products?.length > 0 && (
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate(SCREENS.PRODUCT_LIST)} // Updated navigation
          >
            <FontAwesome name="plus" size={20} color="white" />
            <Text style={styles.checkoutText}>Añadir más productos</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartScreen;
