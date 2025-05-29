import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from './styles/SubCategoryMenuScreenStyle';
import axios from 'axios';
import {API_BASE_URL} from '../../../config/Service.Config';
import SCREENS from '../../../screens';

const SubCategoryMenuScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subcategoryInfo, setSubcategoryInfo] = useState(null);
  const {id, subcategoryName, subcategoryDescription} = route.params || {};

  // Función para cargar los menús de la subcategoría
  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Usar la ruta existente para menús por categoría
      const response = await axios.get(
        `${API_BASE_URL}/menus/subcategory/${id}`,
      );

      setMenus(response.data);

      // Obtener info de subcategoría si es necesario
      try {
        const subcatResponse = await axios.get(
          `${API_BASE_URL}/subcategories/${id}`,
        );
        setSubcategoryInfo(subcatResponse.data);
      } catch (subcatError) {
        console.warn('No se pudo obtener info de subcategoría:', subcatError);
      }
    } catch (err) {
      console.error('Error fetching menus:', err);
      setError('No se pudieron cargar los menús. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMenus();
    }
  }, [id]);

  // Función para renderizar cada ítem del menú
  const renderMenuItem = ({item}) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() =>
        navigation.navigate(SCREENS.MENU_ITEM_DETAILS, {
          id: item._id,
        })
      }>
      <Image
        source={{
          uri: item.images?.[0]?.url || 'https://via.placeholder.com/150',
        }}
        style={styles.menuImage}
      />
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDescription} numberOfLines={2}>
          {item.description}
        </Text>
        {item.location && (
          <Text style={styles.menuLocation}>
            {item.location.city}, {item.location.province}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header con nombre de la subcategoría */}
      <View style={styles.appBarWrapper}>
        <Text style={styles.title}>
          {subcategoryName || subcategoryInfo?.name || 'Subcategoría'}
        </Text>
        {(subcategoryDescription || subcategoryInfo?.description) && (
          <Text style={styles.subtitle}>
            {subcategoryDescription || subcategoryInfo?.description}
          </Text>
        )}
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : menus.length > 0 ? (
          <FlatList
            data={menus}
            renderItem={renderMenuItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={() => (
              <Text style={styles.sectionTitle}>Menús disponibles</Text>
            )}
          />
        ) : (
          <Text style={styles.noData}>No hay menús disponibles</Text>
        )}
      </View>
    </View>
  );
};

export default SubCategoryMenuScreen;
