import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {API_BASE_URL} from '../../../config/Service.Config';
import styles from './styles/OfficialAccountProductsScreen';
import SCREENS from '../../../screens';

const OfficialAccountProductsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {accountId} = route.params || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_BASE_URL}/menus/account/${accountId}`,
        );
        setProducts(response.data);
      } catch (err) {
        setError('No se pudieron cargar los productos de la cuenta.');
        console.error('Error fetching account products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchAccountProducts();
    }
  }, [accountId]);

  const handleProductPress = productId => {
    navigation.navigate(SCREENS.MENU_ITEM_DETAILS, {id: productId});
  };

  const renderProductItem = ({item}) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleProductPress(item._id)}>
      <Image
        source={{
          uri: item.images?.[0]?.url || 'https://via.placeholder.com/100',
        }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name || 'Producto'}</Text>
        <Text style={styles.productLocation}>
          {item.location?.city}, {item.location?.province}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loaderText}>Cargando productos...</Text>
      </View>
    );
  }

  if (error || !products.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'No hay productos disponibles.'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={item => item._id}
      renderItem={renderProductItem}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={() => (
        <Text style={styles.headerText}>Otros Productos</Text>
      )}
    />
  );
};

export default OfficialAccountProductsScreen;
