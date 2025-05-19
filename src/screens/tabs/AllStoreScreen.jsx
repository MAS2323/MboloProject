import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  useWindowDimensions,
  ScrollView,
  Alert,
} from 'react-native';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {API_BASE_URL} from '../../config/Service.Config';
import axios from 'axios';
import SCREENS from '..';
import styles from './styles/AllStoreScreenStyle';

const AllStoreScreen = () => {
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Cuentas Oficiales');
  const {width} = useWindowDimensions();
  const navigation = useNavigation();

  // Calcular dimensiones responsive
  const NUM_COLUMNS = width < 600 ? 2 : 3;
  const ITEM_MARGIN = width * 0.01;
  const ITEM_WIDTH =
    (width - ITEM_MARGIN * (NUM_COLUMNS * 2 + 2)) / NUM_COLUMNS;

  // Cargar las tiendas al montar el componente
  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const url = `${API_BASE_URL}/tienda`;
        if (!API_BASE_URL) {
          throw new Error(
            'API_BASE_URL is undefined. Check Service.Config.js.',
          );
        }
        const response = await axios.get(url);
        const data = response.data;
        if (response.status !== 200) {
          throw new Error(data.message || 'Error fetching stores');
        }
        setTiendas(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching stores:', error.message);
        } else {
          console.error('Error fetching stores:', error);
        }
        Alert.alert('Error', 'No se pudieron cargar las tiendas');
      } finally {
        setLoading(false);
      }
    };
    fetchTiendas();
  }, []);

  // Asegurarse de que al regresar se muestre "Cuentas Oficiales"
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setActiveTab('Cuentas Oficiales');
    });

    return unsubscribe;
  }, [navigation]);

  const renderTiendaItem = ({item}) => (
    <TouchableOpacity
      style={[styles.tiendaItem, {width: ITEM_WIDTH, margin: ITEM_MARGIN}]}
      onPress={() =>
        navigation.navigate(SCREENS.TIENDA_DETALLE_SCREEN, {storeId: item._id})
      }>
      <Image
        source={{uri: item.banner?.url}}
        style={styles.tiendaBanner}
        resizeMode="cover"
      />
      <View style={styles.tiendaInfo}>
        <Text style={styles.tiendaNombre} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.tiendaDescripcion} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c86A8" />
      </View>
    );
  }

  const tabs = ['Cuentas Oficiales', 'AppCenter'];

  return (
    <View style={styles.container}>
      {/* Menú de navegación */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.menuNavContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.menuItem,
              activeTab === tab && styles.menuItemActive,
            ]}
            onPress={() => {
              setActiveTab(tab);
              if (tab === 'AppCenter') {
                navigation.navigate(SCREENS.APP_CENTER);
              }
            }}>
            <Text
              style={[
                styles.menuItemText,
                activeTab === tab && styles.menuItemTextActive,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de tiendas para Cuentas Oficiales */}
      {activeTab === 'Cuentas Oficiales' && (
        <FlatList
          data={tiendas}
          renderItem={renderTiendaItem}
          keyExtractor={item => item._id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={{justifyContent: 'flex-start'}}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay tiendas disponibles</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default AllStoreScreen;
