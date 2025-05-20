import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '../../config/Service.Config';
import {COLORS} from '../../constants';
import styles from './styles/MiTiendaScreenAdminStyle';
import SCREENS from '../../screens';
const MiTiendaScreenAdmin = () => {
  const navigation = useNavigation(); // Replaced useRouter with useNavigation
  const [tienda, setTienda] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Cargar los datos de la tienda y los productos
  useEffect(() => {
    const loadStoreAndProducts = async () => {
      try {
        setIsLoading(true);
        const userId = await AsyncStorage.getItem('id');
        if (!userId) {
          Alert.alert('Error', 'Debes iniciar sesión para ver tu tienda.');
          navigation.navigate('LoginScreen');
          return;
        }
        const cleanUserId = userId.replace(/"/g, '');

        // Check cached data
        const storedStoreData = await AsyncStorage.getItem('store_data');
        const storedProductsData = await AsyncStorage.getItem('products_data');

        if (storedStoreData && storedProductsData) {
          const parsedStoreData = JSON.parse(storedStoreData);
          const parsedProductsData = JSON.parse(storedProductsData);
          if (
            parsedStoreData &&
            parsedStoreData.owner === cleanUserId &&
            parsedStoreData.id &&
            parsedProductsData
          ) {
            setTienda(parsedStoreData);
            setProducts(parsedProductsData);
            setIsLoading(false);
            return;
          }
        }

        // Fetch store details
        let tiendaId = null;
        try {
          const storeResponse = await axios.get(
            `${API_BASE_URL}/tienda/owner/${cleanUserId}`,
          );
          if (storeResponse.data) {
            const storeData = {
              id: storeResponse.data._id,
              nombre: storeResponse.data.name,
              descripcion: storeResponse.data.description,
              telefono: storeResponse.data.phone_number,
              direccion: storeResponse.data.address?.name || '',
              specific_location: storeResponse.data.specific_location,
              propietario: storeResponse.data.owner?.userName || '',
              logo: storeResponse.data.logo?.url,
              banner: storeResponse.data.banner?.url,
              owner: cleanUserId,
            };
            setTienda(storeData);
            tiendaId = storeData.id;
            await AsyncStorage.setItem('store_data', JSON.stringify(storeData));
          } else {
            setTienda(null);
            await AsyncStorage.removeItem('store_data');
            setProducts([]);
            await AsyncStorage.removeItem('products_data');
            setIsLoading(false);
            return;
          }
        } catch (storeError) {
          if (storeError.response?.status === 404) {
            setTienda(null);
            await AsyncStorage.removeItem('store_data');
            setProducts([]);
            await AsyncStorage.removeItem('products_data');
          } else {
            console.error('Error al obtener la tienda:', storeError);
            Alert.alert(
              'Error',
              'No se pudo cargar la información de tu tienda. Intenta de nuevo.',
            );
          }
          setIsLoading(false);
          return;
        }

        // Fetch products by tiendaId
        try {
          const productsResponse = await axios.get(
            `${API_BASE_URL}/products/tienda/${tiendaId}`,
          );
          const fetchedProducts = productsResponse.data.products || [];
          setProducts(fetchedProducts);
          await AsyncStorage.setItem(
            'products_data',
            JSON.stringify(fetchedProducts),
          );
        } catch (productsError) {
          console.error('Error al obtener los productos:', productsError);
          setProducts([]);
          await AsyncStorage.removeItem('products_data');
          Alert.alert(
            'Error',
            'No se pudieron cargar los productos. Intenta de nuevo.',
          );
        }
      } catch (error) {
        console.error('Error general al cargar datos:', error);
        setTienda(null);
        setProducts([]);
        Alert.alert(
          'Error',
          'Ocurrió un error al cargar los datos. Por favor, intenta de nuevo.',
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadStoreAndProducts();
  }, []);

  const renderProduct = ({item}) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        navigation.navigate(SCREENS.PRODUCT_DETAIL, {id: item._id})
      } // Updated navigation
    >
      {item.images && item.images.length > 0 && item.images[0].url ? (
        <Image
          source={{uri: item.images[0].url}}
          style={styles.productImage}
          onError={e =>
            console.error(
              'Error cargando imagen del producto:',
              e.nativeEvent.error,
            )
          }
        />
      ) : (
        <View style={[styles.productImage, styles.placeholderImage]}>
          <Ionicons name="image-outline" size={40} color={COLORS.gray} />
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Tienda</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.ADD_SCREENS)}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Detalles de la tienda y productos */}
      {tienda ? (
        <ScrollView style={styles.content}>
          {/* Detalles de la tienda */}
          <View style={styles.tiendaCard}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              {tienda.banner ? (
                <Image
                  source={{uri: tienda.banner}}
                  style={styles.tiendaBanner}
                  onError={e =>
                    console.error('Error cargando banner:', e.nativeEvent.error)
                  }
                />
              ) : (
                <View style={[styles.tiendaBanner, styles.placeholderImage]}>
                  <Ionicons
                    name="panorama-outline"
                    size={40}
                    color={COLORS.gray}
                  />
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.tiendaHeader}>
              {tienda.logo ? (
                <Image
                  source={{uri: tienda.logo}}
                  style={styles.tiendaLogo}
                  onError={e =>
                    console.error('Error cargando logo:', e.nativeEvent.error)
                  }
                />
              ) : (
                <View style={[styles.tiendaLogo, styles.placeholderImage]}>
                  <Ionicons
                    name="storefront-outline"
                    size={40}
                    color={COLORS.gray}
                  />
                </View>
              )}
              <Text style={styles.tiendaTitle}>{tienda.nombre}</Text>
            </View>
          </View>

          {/* Lista de productos */}
          <Text style={styles.productsHeader}>Productos Publicados</Text>
          {products.length > 0 ? (
            <FlatList
              data={products}
              renderItem={renderProduct}
              keyExtractor={item => item._id}
              scrollEnabled={false}
              style={styles.productsList}
            />
          ) : (
            <Text style={styles.emptyProductsText}>
              No hay productos publicados aún.
            </Text>
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No has creado una tienda aún.</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate(SCREENS.CREAR_TIENDA)}>
            <Text style={styles.createButtonText}>Crear Tienda</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para mostrar el banner y los detalles */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          {tienda?.banner ? (
            <Image
              source={{uri: tienda.banner}}
              style={styles.modalBannerBackground}
              blurRadius={5}
            />
          ) : (
            <View
              style={[styles.modalBannerBackground, styles.placeholderImage]}>
              <Ionicons name="panorama-outline" size={40} color={COLORS.gray} />
            </View>
          )}
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalLogoContainer}>
                {tienda?.logo && (
                  <Image source={{uri: tienda.logo}} style={styles.modalLogo} />
                )}
                <Text style={styles.modalTitle}>{tienda?.nombre}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalDetailsContainer}>
              <View style={styles.tiendaDetails}>
                <Text style={styles.tiendaLabel}>Descripción:</Text>
                <Text style={styles.tiendaText}>{tienda?.descripcion}</Text>
                <Text style={styles.tiendaLabel}>Teléfono:</Text>
                <Text style={styles.tiendaText}>{tienda?.telefono}</Text>
                <Text style={styles.tiendaLabel}>Dirección:</Text>
                <Text style={styles.tiendaText}>{tienda?.direccion}</Text>
                {tienda?.specific_location && (
                  <>
                    <Text style={styles.tiendaLabel}>
                      Ubicación Específica:
                    </Text>
                    <Text style={styles.tiendaText}>
                      {tienda.specific_location}
                    </Text>
                  </>
                )}
                <Text style={styles.tiendaLabel}>Propietario:</Text>
                <Text style={styles.tiendaText}>{tienda?.propietario}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MiTiendaScreenAdmin;
