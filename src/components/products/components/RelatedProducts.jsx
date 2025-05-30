import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {COLORS} from '../../../constants';
import {API_BASE_URL} from '../../../config/Service.Config';
import styles from './styles/RelatedProductsStyle';
import SCREENS from '../../../screens';

const RelatedProducts = ({
  categoryId,
  subcategoryId,
  currentProductId,
  tiendaId,
  onProductPress, // Added as a prop to handle navigation/reload
}) => {
  const navigation = useNavigation();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Unique cache key for AsyncStorage
  const cacheKey = `relatedProducts_${categoryId}_${
    subcategoryId || ''
  }_${currentProductId}_${tiendaId || ''}`;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Check cache
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          console.log('Cargando productos relacionados desde AsyncStorage');
          setRelatedProducts(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        // If no cache, fetch from API
        if (!categoryId || !currentProductId) {
          console.warn(
            'Faltan parámetros requeridos para productos relacionados',
          );
          setRelatedProducts([]);
          setLoading(false);
          return;
        }

        const params = {
          category: categoryId,
          _id: {$ne: currentProductId},
          limit: 6,
        };
        if (subcategoryId) {
          params.subcategory = subcategoryId;
        }

        const response = await axios.get(`${API_BASE_URL}/products`, {params});
        let products = response.data.products || response.data || [];

        if (products.length === 0 && tiendaId) {
          console.log(
            'Sin coincidencias de categoría, obteniendo productos de la tienda',
          );
          const storeResponse = await axios.get(`${API_BASE_URL}/products`, {
            params: {
              tienda: tiendaId,
              _id: {$ne: currentProductId},
              limit: 6,
            },
          });
          products = storeResponse.data.products || storeResponse.data || [];
        }

        // Save to AsyncStorage
        await AsyncStorage.setItem(cacheKey, JSON.stringify(products));
        setRelatedProducts(products);
      } catch (error) {
        console.error('Error al cargar productos relacionados:', error.message);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, subcategoryId, currentProductId, tiendaId, cacheKey]);

  const renderProductItem = useCallback(
    ({item}) => {
      if (!item._id) {
        return <View style={styles.placeholderCard} />;
      }

      return (
        <TouchableOpacity
          style={styles.productCard}
          onPress={() => onProductPress(item._id)} // Use onProductPress instead of navigate
        >
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: item.images?.[0]?.url || 'https://via.placeholder.com/150',
              }}
              style={styles.productImage}
              resizeMode="contain"
              onError={e =>
                console.error('Error cargando imagen:', e.nativeEvent.error)
              }
            />
          </View>
          <Text
            style={styles.productTitle}
            numberOfLines={2}
            ellipsizeMode="tail">
            {item.title || 'Producto sin título'}
          </Text>
          <Text style={styles.productPrice}>${item.price || '0'}</Text>
        </TouchableOpacity>
      );
    },
    [onProductPress], // Added onProductPress to dependency array
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Productos relacionados</Text>
        <Text style={styles.noProductsText}>No hay productos relacionados</Text>
      </View>
    );
  }

  // Create columns of 2 products (for 2 rows)
  const columns = [];
  for (let i = 0; i < Math.ceil(relatedProducts.length / 2); i++) {
    const colProducts = relatedProducts.slice(i * 2, (i + 1) * 2);
    while (colProducts.length < 2) {
      colProducts.push({});
    }
    columns.push(colProducts);
  }

  // Ensure at least 3 columns for scrolling
  while (columns.length < 3) {
    columns.push([{}, {}]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos relacionados</Text>
      <FlatList
        data={columns}
        renderItem={({item: column}) => (
          <View style={styles.column}>
            {column.map((product, index) => (
              <View
                key={product._id || `empty-${index}`}
                style={styles.productWrapper}>
                {renderProductItem({item: product})}
              </View>
            ))}
          </View>
        )}
        keyExtractor={(_, index) => `column-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        initialNumToRender={3}
        maxToRenderPerBatch={6}
      />
    </View>
  );
};

export default RelatedProducts;
