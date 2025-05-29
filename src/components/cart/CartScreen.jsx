import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import styles from './styles/ProductDetails.style'; // Adjust path as needed
import {COLORS} from '../../constants';
import SCREENS from '../../screens';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cart = await AsyncStorage.getItem('cart');
        setCartItems(cart ? JSON.parse(cart) : []);
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    };
    loadCart();
  }, []);

  const removeFromCart = async productId => {
    try {
      const updatedCart = cartItems.filter(item => item._id !== productId);
      setCartItems(updatedCart);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      Alert.alert('Carrito', 'Producto eliminado del carrito');
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      Alert.alert('Error', 'No se pudo eliminar el producto del carrito');
    }
  };

  const handlePressItem = item => {
    navigation.navigate(SCREENS.DETALLES_SCREEN, {item});
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handlePressItem(item)}>
      <View style={styles.card}>
        <Image
          source={{
            uri: item.images?.[0]?.url || 'https://via.placeholder.com/100',
          }}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.title || 'Sin título'}</Text>
          <Text style={styles.price}>XFA{item.price || '0'}</Text>
          <Text style={styles.detailItem}>Cantidad: {item.quantity}</Text>
        </View>
        <TouchableOpacity onPress={() => removeFromCart(item._id)}>
          <MaterialCommunityIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito de Compras</Text>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>El carrito está vacío</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={{paddingBottom: 20}}
        />
      )}
    </View>
  );
};

export default CartScreen;
