import {
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import {useEffect, useState, useCallback} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderSearch from '../header/HeaderSearch';
import {COLORS} from '../../constants';
import {API_BASE_URL} from '../../config/Service.Config';
import styles from './styles/TiendaDetalleStyle';
import SCREENS from '../../screens'; // Adjust path as needed

const TiendaDetalle = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {id} = route.params || {}; // Get id from navigation params
  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pestañaActiva, setPestañaActiva] = useState('recomendados');
  const [productos, setProductos] = useState([]);
  const [visibleProductos, setVisibleProductos] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Log id to debug
  useEffect(() => {
    console.log('TiendaDetalle received id:', id);
    if (!id) {
      Alert.alert('Error', 'ID de tienda no proporcionado');
    }
  }, [id]);

  // Cargar datos de la tienda
  useEffect(() => {
    const cargarTienda = async () => {
      try {
        if (!id) {
          throw new Error('ID de tienda no proporcionado');
        }
        const url = `${API_BASE_URL}/tienda/${id}`;
        const response = await axios.get(url);
        const data = response.data;

        const tiendaData = {
          banner: {url: data.banner?.url || 'https://via.placeholder.com/150'},
          logo: {url: data.logo?.url || 'https://via.placeholder.com/50'},
          name: data.name || 'Sin nombre',
          descripcion: data.description || 'Sin descripción',
          telefono: data.phone_number || 'No disponible',
          direccion: data.address?.name || 'No disponible',
          specific_location: data.specific_location || '',
          propietario: data.owner?.userName || 'Anónimo',
          owner: data.owner,
        };

        setTienda(tiendaData);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar la tienda:', err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      cargarTienda();
    }
  }, [id]);

  // Cargar productos reales basados en tiendaId
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        if (!id) {
          throw new Error('ID de tienda no proporcionado');
        }
        const url = `${API_BASE_URL}/products/tienda/${id}`;
        const response = await axios.get(url);
        let fetchedProducts = response.data.products || [];

        // Deduplicate products by _id
        fetchedProducts = Array.from(
          new Map(fetchedProducts.map(item => [item._id, item])).values(),
        );

        // Map backend product fields to expected frontend structure
        const formattedProducts = fetchedProducts.map(product => ({
          id: product._id,
          nombre: product.title || 'Sin título',
          descripcion: product.description || 'Sin descripción',
          precio: product.price || 0,
          ventas: product.sales || 0,
          imagen: product.images?.[0]?.url || 'https://via.placeholder.com/150',
          categoria: product.category?.name || 'Sin categoría',
          nuevo: product.createdAt
            ? new Date(product.createdAt) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            : false,
          valoracion: product.rating || 4.0,
          envioRapido: product.shipping?.fast || false,
        }));

        setProductos(formattedProducts);
        setVisibleProductos(formattedProducts.slice(0, 2));
      } catch (err) {
        console.error('Error al cargar productos:', err.message);
        setProductos([]);
        setVisibleProductos([]);
      }
    };

    if (id) {
      cargarProductos();
    }
  }, [id]);

  // Cargar más productos progresivamente
  const loadMoreProductos = useCallback(() => {
    if (visibleProductos.length < productos.length && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        const nextProductos = productos.slice(
          visibleProductos.length,
          visibleProductos.length + 2,
        );
        setVisibleProductos(prev => [...prev, ...nextProductos]);
        setIsLoadingMore(false);
      }, 1000);
    }
  }, [visibleProductos, productos, isLoadingMore]);

  const renderizarProducto = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.tarjetaProducto}
        onPress={() => {
          console.log('Navigating to ProductDetail with id:', item.id);
          navigation.navigate(SCREENS.PRODUCT_DETAIL, {id: item.id});
        }}>
        <Image source={{uri: item.imagen}} style={styles.imagenProducto} />
        <View style={styles.infoProducto}>
          <Text style={styles.tituloProducto}>{item.nombre}</Text>
          <Text style={styles.descripcionProducto}>{item.descripcion}</Text>

          {item.nuevo && (
            <View style={styles.etiquetaNuevo}>
              <Text style={styles.textoEtiquetaNuevo}>NUEVO</Text>
            </View>
          )}

          <View style={styles.metaProducto}>
            <View style={styles.datosProducto}>
              <Text style={styles.ventasProducto}>
                🔥 {item.ventas}+ vendidos
              </Text>
              {item.envioRapido && (
                <Text style={styles.envioRapido}>Envío rápido</Text>
              )}
            </View>
            <Text style={styles.precioProducto}>${item.precio}</Text>
          </View>

          <View style={styles.valoracionContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.textoValoracion}>{item.valoracion}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [navigation],
  );

  const renderFooter = useCallback(() => {
    return isLoadingMore ? (
      <View style={styles.contenedorCarga}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    ) : null;
  }, [isLoadingMore]);

  const ListHeader = () => (
    <>
      {/* Banner de la tienda */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {tienda?.banner?.url ? (
          <Image source={{uri: tienda.banner.url}} style={styles.banner} />
        ) : (
          <View style={[styles.banner, styles.placeholderImage]}>
            <Ionicons name="panorama-outline" size={40} color={COLORS.gray} />
          </View>
        )}
      </TouchableOpacity>

      {/* Encabezado con logo y nombre */}
      <View style={styles.encabezado}>
        <View style={styles.infoTienda}>
          {tienda?.logo?.url && (
            <Image source={{uri: tienda.logo.url}} style={styles.logo} />
          )}
          <View style={styles.datosTienda}>
            <Text style={styles.nombreTienda}>{tienda.name}</Text>
            <Text style={styles.propietarioTienda}>
              Vendedor: {tienda.propietario}
            </Text>
          </View>
        </View>

        {/* Estadísticas de la tienda */}
        <View style={styles.estadisticas}>
          <View style={styles.itemEstadistica}>
            <Text style={styles.valorEstadistica}>🔥 16.0K</Text>
            <Text style={styles.etiquetaEstadistica}>seguidores</Text>
          </View>
          <View style={styles.itemEstadistica}>
            <Text style={styles.valorEstadistica}>6K</Text>
            <Text style={styles.etiquetaEstadistica}>reseñas</Text>
          </View>
          <View style={styles.itemEstadistica}>
            <Text style={styles.valorEstadistica}>20h</Text>
            <Text style={styles.etiquetaEstadistica}>envío</Text>
          </View>
        </View>
      </View>

      {/* Pestañas de navegación */}
      <View style={styles.contenedorPestañas}>
        {['Recomendados', 'Productos', 'Categorías', 'Nuevos'].map(pestaña => (
          <TouchableOpacity
            key={pestaña}
            style={[
              styles.pestaña,
              pestañaActiva === pestaña.toLowerCase() && styles.pestañaActiva,
            ]}
            onPress={() => setPestañaActiva(pestaña.toLowerCase())}>
            <Text
              style={[
                styles.textoPestaña,
                pestañaActiva === pestaña.toLowerCase() &&
                  styles.textoPestañaActiva,
              ]}>
              {pestaña}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  if (loading) {
    return (
      <View style={styles.contenedorCarga}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !tienda) {
    return (
      <View style={styles.contenedorError}>
        <Text style={styles.textoError}>
          {error || 'No se pudo cargar la tienda.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <HeaderSearch title="Tienda" />
      <FlatList
        data={visibleProductos}
        renderItem={renderizarProducto}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : `product-${index}`
        }
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listaProductos}
        showsVerticalScrollIndicator={false}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        removeClippedSubviews={true}
        onEndReached={loadMoreProductos}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />

      {/* Modal para mostrar el banner y los detalles */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          {tienda?.banner?.url ? (
            <Image
              source={{uri: tienda.banner.url}}
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
                {tienda?.logo?.url && (
                  <Image
                    source={{uri: tienda.logo.url}}
                    style={styles.modalLogo}
                  />
                )}
                <Text style={styles.modalTitle}>{tienda.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalDetailsContainer}>
              <View style={styles.tiendaDetails}>
                <Text style={styles.tiendaLabel}>Descripción:</Text>
                <Text style={styles.tiendaText}>{tienda.descripcion}</Text>
                <Text style={styles.tiendaLabel}>Teléfono:</Text>
                <Text style={styles.tiendaText}>{tienda.telefono}</Text>
                <Text style={styles.tiendaLabel}>Dirección:</Text>
                <Text style={styles.tiendaText}>{tienda.direccion}</Text>
                {tienda.specific_location && (
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
                <Text style={styles.tiendaText}>{tienda.propietario}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TiendaDetalle;
