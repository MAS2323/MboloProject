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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '../../config/Service.Config';
import {COLORS} from '../../constants';
import SCREENS from '../../screens';
import styles from './styles/MiTiendaScreenStyle';

const MiTiendaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id} = route.params || {}; // Get storeId from navigation params
  const [tienda, setTienda] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadStoreAndProducts = async () => {
      try {
        setIsLoading(true);

        let tiendaId = id;
        let isOwnStore = false;

        // If no storeId provided, fetch the user's own store
        if (!tiendaId) {
          const userId = await AsyncStorage.getItem('id');
          if (!userId) {
            Alert.alert('Error', 'Debes iniciar sesión para ver tu tienda.');
            navigation.navigate('LoginScreen');
            return;
          }
          const cleanUserId = userId.replace(/"/g, '');
          const storeResponse = await axios.get(
            `${API_BASE_URL}/tienda/owner/${cleanUserId}`,
          );
          if (storeResponse.data) {
            tiendaId = storeResponse.data._id;
            isOwnStore = true;
          } else {
            setTienda(null);
            setProducts([]);
            setIsLoading(false);
            return;
          }
        }

        // Check cached data
        const cacheKey = `store_${tiendaId}`;
        const storedStoreData = await AsyncStorage.getItem(`${cacheKey}_data`);
        const storedProductsData = await AsyncStorage.getItem(
          `${cacheKey}_products`,
        );

        if (storedStoreData && storedProductsData) {
          const parsedStoreData = JSON.parse(storedStoreData);
          const parsedProductsData = JSON.parse(storedProductsData);
          if (parsedStoreData && parsedProductsData) {
            setTienda(parsedStoreData);
            setProducts(parsedProductsData);
            setIsLoading(false);
            return;
          }
        }

        // Fetch store details
        try {
          const storeResponse = await axios.get(
            `${API_BASE_URL}/tienda/${tiendaId}`,
          );
          if (storeResponse.data) {
            const storeData = {
              id: storeResponse.data._id,
              name: storeResponse.data.name,
              description: storeResponse.data.description,
              phone_number: storeResponse.data.phone_number,
              address: storeResponse.data.address?.name || '',
              specific_location: storeResponse.data.specific_location,
              owner_name: storeResponse.data.owner?.userName || '',
              logo: storeResponse.data.logo?.url,
              banner: storeResponse.data.banner?.url,
            };
            setTienda(storeData);
            await AsyncStorage.setItem(
              `${cacheKey}_data`,
              JSON.stringify(storeData),
            );
          } else {
            setTienda(null);
            await AsyncStorage.removeItem(`${cacheKey}_data`);
            setProducts([]);
            await AsyncStorage.removeItem(`${cacheKey}_products`);
            setIsLoading(false);
            return;
          }
        } catch (storeError) {
          console.error('Error al obtener la tienda:', storeError);
          setTienda(null);
          setProducts([]);
          setIsLoading(false);
          Alert.alert(
            'Error',
            'No se pudo cargar la información de la tienda.',
          );
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
            `${cacheKey}_products`,
            JSON.stringify(fetchedProducts),
          );
        } catch (productsError) {
          console.error('Error al obtener los productos:', productsError);
          setProducts([]);
          await AsyncStorage.removeItem(`${cacheKey}_products`);
          Alert.alert('Error', 'No se pudieron cargar los productos.');
        }
      } catch (error) {
        console.error('Error general al cargar datos:', error);
        setTienda(null);
        setProducts([]);
        Alert.alert('Error', 'Ocurrió un error al cargar los datos.');
      } finally {
        setIsLoading(false);
      }
    };
    loadStoreAndProducts();
  }, [id, navigation]);

  const renderProduct = ({item}) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        navigation.navigate(SCREENS.PRODUCT_DETAIL, {id: item._id})
      }>
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
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tienda?.name || 'Tienda'}</Text>
        {tienda?.owner && (
          <TouchableOpacity onPress={() => navigation.navigate('AddScreen')}>
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
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
              <Text style={styles.tiendaTitle}>{tienda.name}</Text>
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
          <Text style={styles.emptyText}>No se encontró la tienda.</Text>
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
                <Text style={styles.modalTitle}>{tienda?.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalDetailsContainer}>
              <View style={styles.tiendaDetails}>
                <Text style={styles.tiendaLabel}>Descripción:</Text>
                <Text style={styles.tiendaText}>{tienda?.description}</Text>
                <Text style={styles.tiendaLabel}>Teléfono:</Text>
                <Text style={styles.tiendaText}>{tienda?.phone_number}</Text>
                <Text style={styles.tiendaLabel}>Dirección:</Text>
                <Text style={styles.tiendaText}>{tienda?.address}</Text>
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
                <Text style={styles.tiendaText}>{tienda?.owner_name}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MiTiendaScreen;
