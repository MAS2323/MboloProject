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
} from 'react-native';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from './styles/ProductDetails.style'; // Adjust path as needed
import {COLORS, ICONS} from '../../constants'; // Adjust path as needed
import SCREENS from '../../screens'; // Adjust path as needed
import {API_BASE_URL} from '../../config/Service.Config';
const IconComponents = {
  Ionicons: require('react-native-vector-icons/Ionicons').default,
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
  const [count, setCount] = useState(1);
  const [showHeader, setShowHeader] = useState(false);

  // Extract item from route params or use ID for API fetch
  const params = route.params || {};
  const {item, id} = params;

  // Map icon libraries
  const BackArrowIcon = IconComponents[ICONS.BACK_ARROW.library];
  const ShoppingBagIcon = IconComponents[ICONS.SHOPING_BAG.library];
  const StarIcon = IconComponents[ICONS.START.library];
  const PlusIcon = IconComponents[ICONS.PLUS.library];
  const MinusIcon = IconComponents[ICONS.MINUS.library];
  const LocationIcon = IconComponents[ICONS.LOCATION.library];
  const DeliveryIcon = IconComponents[ICONS.DELIVERY.library];
  const PhoneIcon = IconComponents[ICONS.PHONE.library];
  const WhatsAppIcon = IconComponents[ICONS.WHATSAPP.library];

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id && !item) {
          throw new Error(
            'ID de producto o datos del producto no proporcionados',
          );
        }
        if (item) {
          setProduct(item);
        } else if (id) {
          const response = await axios.get(`${API_BASE_URL}/products/${id}`);
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Error al cargar el producto:', error.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, item]);

  // Fetch store data
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

  // Quantity controls
  const handleIncrement = () => setCount(prevCount => prevCount + 1);
  const handleDecrement = () =>
    setCount(prevCount => (prevCount > 1 ? prevCount - 1 : prevCount));

  // Contact handlers
  const openWhatsApp = () => {
    const url = `whatsapp://send?phone=${product?.whatsapp}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'No se puede abrir WhatsApp'),
    );
  };

  const openPhoneDialer = () => {
    const url = `tel:${product?.phoneNumber}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'No se puede abrir el marcador telefónico'),
    );
  };

  // Share functionality (simplified for React Native CLI)
  const handleShare = () => {
    if (!product?._id) {
      Alert.alert('Error', 'ID de producto no válido');
      return;
    }
    const message = `Mira este producto: ${product.title}\n\n${product.description}\n\nPrecio: ${product.price}\n\nEnlace: ${API_BASE_URL}/products/${product._id}`;
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`).catch(() =>
      Alert.alert('Error', 'No se pudo compartir el producto'),
    );
  };

  // Handle scroll to show/hide header
  const handleScroll = ({nativeEvent}) => {
    const scrollY = nativeEvent.contentOffset.y;
    const imageSectionHeight = Dimensions.get('window').height * 0.4;
    const triggerPoint = imageSectionHeight / 2;
    setShowHeader(scrollY > triggerPoint);
  };

  // Mock HeaderScreen component
  const HeaderScreen = () => (
    <View style={styles.header}>
      <Text style={{fontSize: 18, fontWeight: 'bold', color: COLORS.black}}>
        My App
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={{color: COLORS.blue, fontSize: 16}}>Home</Text>
      </TouchableOpacity>
    </View>
  );

  // Mock StoreCard component
  const StoreCard = ({store, productComments}) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{store?.name || 'Tienda'}</Text>
      {store?.logo && (
        <Image source={{uri: store.logo}} style={styles.storeLogo} />
      )}
      <Text style={styles.storeDescription}>
        {store?.description || 'Sin descripción'}
      </Text>
      <Text style={styles.storeText}>Dirección: {store?.address}</Text>
      <Text style={styles.storeText}>
        Teléfono: {store?.phone_number || 'N/A'}
      </Text>
      {productComments?.length > 0 && (
        <View style={styles.commentsWrapper}>
          <Text style={styles.commentsTitle}>
            Comentarios ({productComments.length})
          </Text>
          {productComments.slice(0, 3).map((comment, index) => (
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
          {productComments.length > 3 && (
            <TouchableOpacity>
              <Text style={styles.viewMoreComments}>Ver más comentarios</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  // Mock RelatedProducts component
  const RelatedProducts = ({
    categoryId,
    subcategoryId,
    currentProductId,
    tiendaId,
  }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Productos Relacionados</Text>
      <Text style={styles.storeText}>
        Placeholder para productos relacionados (Categoría: {categoryId},
        Subcategoría: {subcategoryId})
      </Text>
    </View>
  );

  // Fallback UI for no product
  if (!product && !loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Producto no disponible</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Define sections for FlatList
  const sections = [
    {type: 'images', data: product.images || []},
    {type: 'details', data: product},
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

  // Render sections
  const renderSection = ({item}) => {
    switch (item.type) {
      case 'images':
        return (
          <View style={styles.sectionContainer}>
            <View style={styles.upperRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <BackArrowIcon
                  name={ICONS.BACK_ARROW.name}
                  size={ICONS.BACK_ARROW.size}
                  color={COLORS.black}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare}>
                <IconComponents.MaterialCommunityIcons
                  name="share-variant"
                  size={30}
                  color={COLORS.black}
                />
              </TouchableOpacity>
            </View>
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
            />
          </View>
        );

      case 'details':
        return (
          <View style={styles.sectionContainer}>
            <View style={styles.details}>
              <View style={styles.titleRow}>
                <Text
                  style={styles.title}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item.data.title || 'Producto sin título'}
                </Text>
                <View style={styles.priceWrapper}>
                  <Text style={styles.price}>XAF {item.data.price || '0'}</Text>
                </View>
              </View>
              <View style={styles.ratingRow}>
                <View style={styles.rating}>
                  {[1, 2, 3, 4, 5].map(index => (
                    <StarIcon
                      key={index}
                      name={ICONS.START.name}
                      size={ICONS.START.size}
                      color="gold"
                    />
                  ))}
                  <Text style={styles.ratingText}>(4.9)</Text>
                </View>
                <View style={styles.quantityControl}>
                  <TouchableOpacity onPress={handleIncrement}>
                    <PlusIcon
                      name={ICONS.PLUS.name}
                      size={ICONS.PLUS.size}
                      color={COLORS.black}
                    />
                  </TouchableOpacity>
                  <Text style={styles.ratingText}>{count}</Text>
                  <TouchableOpacity onPress={handleDecrement}>
                    <MinusIcon
                      name={ICONS.MINUS.name}
                      size={ICONS.MINUS.size}
                      color={COLORS.black}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.descriptionWrapper}>
                <Text style={styles.descriptionTitle}>Descripción</Text>
                <Text style={styles.description}>
                  {item.data.description || 'Sin descripción'}
                </Text>
              </View>
              <View style={styles.detailsWrapper}>
                <Text style={styles.detailItem}>
                  Categoría:{' '}
                  {item.data.subcategory?.category?.name || 'No especificada'}
                </Text>
                <Text style={styles.detailItem}>
                  Subcategoría:{' '}
                  {item.data.subcategory?.name || 'No especificada'}
                </Text>
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
              <View style={styles.locationWrapper}>
                <View style={styles.location}>
                  <LocationIcon
                    name={ICONS.LOCATION.name}
                    size={ICONS.LOCATION.size}
                    color={COLORS.black}
                  />
                  <Text>{item.data.product_location || 'No especificada'}</Text>
                </View>
                <View style={styles.location}>
                  <DeliveryIcon
                    name={ICONS.DELIVERY.name}
                    size={ICONS.DELIVERY.size}
                    color={COLORS.black}
                  />
                  <Text>Entrega gratis</Text>
                </View>
              </View>
              <View style={styles.cartRow}>
                <TouchableOpacity onPress={() => {}} style={styles.cartBtn}>
                  <Text style={styles.cartTitle}>Contáctanos y compra</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate(SCREENS.CART_SCREEN)}
                  style={styles.addCart}>
                  <ShoppingBagIcon
                    name={ICONS.SHOPING_BAG.name}
                    size={ICONS.SHOPING_BAG.size}
                    color={COLORS.lightwhite}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.contactRow}>
                <TouchableOpacity
                  onPress={openPhoneDialer}
                  style={styles.contactBtn}>
                  <PhoneIcon
                    name={ICONS.PHONE.name}
                    size={ICONS.PHONE.size}
                    color={COLORS.blue}
                  />
                  <Text style={styles.contactText}>
                    {item.data.phoneNumber || 'N/A'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={openWhatsApp}
                  style={styles.contactBtn}>
                  <WhatsAppIcon
                    name={ICONS.WHATSAPP.name}
                    size={ICONS.WHATSAPP.size}
                    color={COLORS.blue}
                  />
                  <Text style={styles.contactText}>
                    {item.data.whatsapp || 'N/A'}
                  </Text>
                </TouchableOpacity>
              </View>
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
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.7}>
          <HeaderScreen />
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
