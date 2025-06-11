import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Share,
} from 'react-native';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from './styles/ProductDetails.style';
import {COLORS, ICONS, SIZES} from '../../constants';
import SCREENS from '../../screens';
import {API_BASE_URL} from '../../config/Service.Config';
import RelatedProducts from './components/RelatedProducts';
import StoreCard from './components/StoreCard';
import HeaderSearch from '../header/HeaderSearch';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  SimpleLineIcons: require('react-native-vector-icons/SimpleLineIcons').default,
  MaterialCommunityIcons:
    require('react-native-vector-icons/MaterialCommunityIcons').default,
  Fontisto: require('react-native-vector-icons/Fontisto').default,
};

const ProductDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHeader, setShowHeader] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const params = route.params || {};
  const {item, id} = params;

  const BackArrowIcon = IconComponents[ICONS.BACK_ARROW.library];
  const ShaerIcons = IconComponents[ICONS.SHARE_ICON.library];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id && !item) {
          throw new Error(
            'ID de producto o datos del producto no proporcionados',
          );
        }
        const response = await axios.get(
          `${API_BASE_URL}/products/${id || item._id}`,
        );
        setProduct(response.data);
      } catch (error) {
        console.error('Error al cargar el producto:', error.message);
        setProduct(null);
        Alert.alert('Error', 'No se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, item]);

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        if (!product) {
          setStore(null);
          return;
        }
        if (product.tienda?._id) {
          setStore({
            id: product.tienda._id,
            name: product.tienda.name,
            logo: product.tienda.logo?.url,
            description: product.tienda.description,
            phone_number: product.tienda.phone_number,
            address: product.tienda.address?.name || 'No disponible',
            specific_location: product.tienda.specific_location,
            owner: product.tienda.owner?.userName || 'Anónimo',
            banner: product.tienda.banner?.url,
          });
        } else if (product.tienda && typeof product.tienda === 'string') {
          const response = await axios.get(
            `${API_BASE_URL}/tienda/${product.tienda}`,
          );
          const data = response.data;
          setStore({
            id: data._id,
            name: data.name,
            logo: data.logo?.url,
            description: data.description,
            phone_number: data.phone_number,
            address: data.address?.name || 'No disponible',
            specific_location: data.specific_location,
            owner: data.owner?.userName || 'Anónimo',
            banner: data.banner?.url,
          });
        } else {
          setStore(null);
        }
      } catch (error) {
        console.error('Error al cargar datos de la tienda:', error.message);
        setStore(null);
      }
    };
    loadStoreData();
  }, [product]);

  const handleShare = async () => {
    try {
      if (!product?._id) {
        throw new Error('ID de producto no válido');
      }

      const productUrl = `${API_BASE_URL}/products/shortLink/${product._id}`;
      console.log('Sharing URL:', productUrl);
      const response = await axios.post(productUrl);

      if (!response.data?.shortLink) {
        throw new Error('No se pudo generar el enlace corto');
      }

      const shortLink = response.data.shortLink;
      const message = `Mira este producto: ${product.title}\n\n${product.description}\n\nPrecio: ${product.price}\n\nEnlace: ${shortLink}`;

      const result = await Share.share({
        message,
        url: shortLink,
        title: product.title,
      });

      if (result.action === Share.sharedAction) {
        console.log('Compartido con éxito');
      } else if (result.action === Share.dismissedAction) {
        console.log('Compartir cancelado');
      }
    } catch (error) {
      console.error('Error al compartir:', error.message, error.response?.data);
      Alert.alert(
        'Error',
        'Hubo un problema al generar el enlace. Intenta de nuevo.',
      );
    }
  };

  const handleHeaderPress = event => {
    event.stopPropagation();
    navigation.navigate(SCREENS.HOME_STACK);
  };

  const handleScroll = ({nativeEvent}) => {
    const scrollY = nativeEvent.contentOffset.y;
    const imageSectionHeight = SCREEN_HEIGHT * 0.4;
    setShowHeader(scrollY > imageSectionHeight / 2);
  };

  const handleImageScroll = ({nativeEvent}) => {
    const index = Math.round(nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const handleRelatedProductPress = productId => {
    navigation.replace(SCREENS.PRODUCT_DETAIL, {id: productId});
  };

  if (!product && !loading) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Producto no disponible</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver">
          <Text style={styles.retryButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const sections = [
    {type: 'images', data: product.images || []},
    {type: 'details', data: product},
    {type: 'packages', data: product.packages || []},
    {type: 'store', data: store},
    {
      type: 'related',
      data: {
        categoryId: product.category,
        subcategoryId: product.subcategory?._id,
        currentProductId: product._id,
        tiendaId: product.tienda?._id || product.tienda,
      },
    },
  ];

  const renderSection = ({item}) => {
    switch (item.type) {
      case 'images':
        return (
          <View style={styles.imageSectionContainer}>
            <FlatList
              data={item.data}
              renderItem={({item: image, index}) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(SCREENS.IMAGE_GALLERY_SCREEN, {
                      images: product.images,
                      index,
                    })
                  }>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{
                        uri: image.url || 'https://via.placeholder.com/300',
                      }}
                      style={styles.image}
                    />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(image, index) => `image-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              onScroll={handleImageScroll}
              scrollEventThrottle={16}
            />
            <View style={styles.upperRow}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.goBack()}
                accessibilityLabel="Volver">
                <BackArrowIcon
                  name={ICONS.BACK_ARROW.name}
                  size={ICONS.BACK_ARROW.size || 24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleShare}
                accessibilityLabel="Compartir producto">
                <ShaerIcons
                  name={ICONS.SHARE_ICON.name}
                  size={ICONS.SHARE_ICON.size || 24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
            {item.data.length > 1 && (
              <View style={styles.paginationContainer}>
                {item.data.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentImageIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        );

      case 'details':
        return (
          <View style={styles.sectionContainer}>
            <View style={styles.details}>
              <View style={styles.priceRow}>
                <Text style={styles.price}>XFA {item.data.price || '0'}</Text>
              </View>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {item.data.title || 'Producto sin título'}
              </Text>
              <View style={styles.detailsWrapper}>
                <Text style={styles.detailItem}>
                  Categoría:{' '}
                  {item.data.subcategory?.category?.name ||
                    item.data.category?.name ||
                    'No especificada'}
                </Text>
                <Text style={styles.detailItem}>
                  Subcategoría:{' '}
                  {item.data.subcategory?.name || 'No especificada'}
                </Text>
                {item.data.brand && (
                  <Text style={styles.detailItem}>
                    Marca: {item.data.brand}
                  </Text>
                )}
                {item.data.condition && (
                  <Text style={styles.detailItem}>
                    Condición:{' '}
                    {item.data.condition === 'new'
                      ? 'Nuevo'
                      : item.data.condition === 'used'
                      ? 'Usado'
                      : item.data.condition === 'refurbished'
                      ? 'Reacondicionado'
                      : item.data.condition}
                  </Text>
                )}
                {item.data.year && (
                  <Text style={styles.detailItem}>Año: {item.data.year}</Text>
                )}
                {item.data.location && (
                  <Text style={styles.detailItem}>
                    Ubicación:{' '}
                    {item.data.location.name ||
                      item.data.location.address ||
                      'No especificada'}
                  </Text>
                )}
                {(item.data.dimensions?.length ||
                  item.data.dimensions?.width ||
                  item.data.dimensions?.height) && (
                  <Text style={styles.detailItem}>
                    Dimensiones:{' '}
                    {[
                      item.data.dimensions.length &&
                        `${item.data.dimensions.length}${item.data.dimensions.unit}`,
                      item.data.dimensions.width &&
                        `${item.data.dimensions.width}${item.data.dimensions.unit}`,
                      item.data.dimensions.height &&
                        `${item.data.dimensions.height}${item.data.dimensions.unit}`,
                    ]
                      .filter(Boolean)
                      .join(' x ') || 'No especificadas'}
                  </Text>
                )}
                {item.data.weight?.value && (
                  <Text style={styles.detailItem}>
                    Peso: {item.data.weight.value}
                    {item.data.weight.unit}
                  </Text>
                )}
                {item.data.features?.length > 0 && (
                  <Text style={styles.detailItem}>
                    Características: {item.data.features.join(', ')}
                  </Text>
                )}
                {item.data.specifications &&
                  Object.keys(item.data.specifications).length > 0 && (
                    <View style={styles.specificationsWrapper}>
                      <Text style={styles.detailItem}>Especificaciones:</Text>
                      {Object.entries(item.data.specifications).map(
                        ([key, value], index) => (
                          <Text key={index} style={styles.detailItem}>
                            {key}: {value}
                          </Text>
                        ),
                      )}
                    </View>
                  )}
                {item.data.stock !== undefined && (
                  <Text style={styles.detailItem}>
                    Stock: {item.data.stock}
                  </Text>
                )}
                {(item.data.warranty?.duration ||
                  item.data.warranty?.description) && (
                  <Text style={styles.detailItem}>
                    Garantía:{' '}
                    {item.data.warranty.duration
                      ? `${item.data.warranty.duration} meses`
                      : ''}
                    {item.data.warranty.duration &&
                    item.data.warranty.description
                      ? ', '
                      : ''}
                    {item.data.warranty.description || ''}
                  </Text>
                )}
                {item.data.tallas?.length > 0 && (
                  <Text style={styles.detailItem}>
                    Tallas disponibles: {item.data.tallas.join(', ')}
                  </Text>
                )}
                {item.data.numeros_calzado?.length > 0 && (
                  <Text style={styles.detailItem}>
                    Números de calzado: {item.data.numeros_calzado.join(', ')}
                  </Text>
                )}
                {item.data.colores?.length > 0 && (
                  <Text style={styles.detailItem}>
                    Colores disponibles: {item.data.colores.join(', ')}
                  </Text>
                )}
              </View>
              <View style={styles.descriptionWrapper}>
                <Text style={styles.descriptionTitle}>Descripción</Text>
                <Text style={styles.description}>
                  {item.data.description || 'Sin descripción'}
                </Text>
              </View>
              {item.data.comentarios?.length > 0 && (
                <View style={styles.commentsWrapper}>
                  <Text style={styles.commentsTitle}>
                    Comentarios ({item.data.comentarios.length})
                  </Text>
                  {item.data.comentarios.slice(0, 3).map((comment, index) => (
                    <View key={index} style={styles.commentItem}>
                      <Text style={styles.commentUser}>
                        {comment.user?.userName || 'Anónimo'}
                      </Text>
                      <Text style={styles.commentText}>{comment.comment}</Text>
                      <Text style={styles.commentDate}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  ))}
                  {item.data.comentarios.length > 3 && (
                    <TouchableOpacity>
                      <Text style={styles.viewMoreComments}>
                        Ver más comentarios
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        );
      case 'store':
        return (
          <StoreCard store={item.data} productComments={product.comentarios} />
        );
      case 'related':
        return (
          <RelatedProducts
            categoryId={item.data.categoryId}
            subcategoryId={item.data.subcategoryId}
            currentProductId={item.data.currentProductId}
            tiendaId={item.data.tiendaId}
            onProductPress={handleRelatedProductPress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {showHeader && (
        <TouchableOpacity
          style={styles.header}
          onPress={handleHeaderPress}
          activeOpacity={0.7}
          accessibilityLabel="Ir a la página principal">
          <HeaderSearch />
        </TouchableOpacity>
      )}
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default ProductDetails;
