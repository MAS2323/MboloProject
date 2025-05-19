import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {COLORS, SIZES} from '../../constants';
import styles from './styles/ProductList.Style';
import ProductCardView from './ProductCardView';
import {API_BASE_URL} from '../../config/Service.Config';
import SCREENS from '../../screens';
import HeaderSearch from '../header/HeaderSearch';

const ProductList = ({userId}) => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Configuración responsive
  const isLargeScreen = width >= 768;
  const numColumns = isLargeScreen ? 3 : 2;
  const categoryFontSize = isLargeScreen ? SIZES.medium : SIZES.small;
  const productMargin = isLargeScreen ? SIZES.medium : SIZES.small;

  // Fetch products (replacing useFetch)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/products`);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al cargar los productos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/categories?type=product`,
        );
        setCategorias(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'No se pudieron cargar las categorías.');
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = category => {
    setSelectedCategory(category);
    navigation.navigate(SCREENS.PRODUCT_LIST_CATEGORY, {
      categoryId: category._id,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={SIZES.xxLarge} color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{color: COLORS.red, fontSize: SIZES.medium}}>
          Error al cargar los productos. Inténtalo de nuevo.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderSearch title="PRODUCTOS" />

      {/* Lista de Categorías (Horizontal) */}
      <View
        style={[
          styles.appBarWrapper,
          {paddingHorizontal: isLargeScreen ? SIZES.large : SIZES.small},
        ]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryListContainer}>
          {categorias.map(category => (
            <TouchableOpacity
              key={category._id}
              style={[
                styles.categoryButton,
                selectedCategory?._id === category._id &&
                  styles.selectedCategoryButton,
                {
                  paddingHorizontal: isLargeScreen ? SIZES.large : SIZES.medium,
                },
              ]}
              onPress={() => handleCategorySelect(category)}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory?._id === category._id &&
                    styles.selectedCategoryText,
                  {fontSize: categoryFontSize},
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de Productos (Grid) */}
      <FlatList
        data={products}
        numColumns={numColumns}
        renderItem={({item}) => (
          <View
            style={{
              flex: 1 / numColumns,
              margin: productMargin,
              maxWidth: isLargeScreen ? '33.33%' : '50%',
            }}>
            <ProductCardView
              item={item}
              userId={userId}
              cardStyle={{
                height: isLargeScreen ? 280 : 220,
                borderRadius: isLargeScreen ? SIZES.medium : SIZES.small,
              }}
            />
          </View>
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={[
          styles.flatListContent,
          {paddingHorizontal: isLargeScreen ? SIZES.large : SIZES.small},
        ]}
        ItemSeparatorComponent={() => <View style={{height: productMargin}} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay productos disponibles</Text>
          </View>
        }
      />
    </View>
  );
};

export default ProductList;
