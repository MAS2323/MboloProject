import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {COLORS, ICONS} from '../../../../constants';
import SCREENS from '../../../../screens';
import {API_BASE_URL} from '../../../../config/Service.Config';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from './styles/SelectCityStyle';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};

const SelectCityScreen = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const {returnScreen} = route.params || {};
  const ChevronLeftIcon = IconComponents[ICONS.CHEVRON_LEFT.library];

  // Verificar usuario existente y cargar datos desde AsyncStorage
  const checkExistingUser = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      console.log('Stored ID:', id);
      if (!id) {
        console.log('No user ID found, navigating to LoginScreen');
        navigation.navigate(SCREENS.LOGINSCREEN);
        return;
      }
      const parsedId = JSON.parse(id);
      const userId = `user${parsedId}`;
      const currentUser = await AsyncStorage.getItem(userId);
      console.log('Stored User Data:', currentUser);
      if (currentUser) {
        const parsedUserData = JSON.parse(currentUser);
        setUserData(parsedUserData);
        setUserId(parsedId);
        setIsLoggedIn(true);
      } else {
        console.log('No user data found, navigating to LoginScreen');
        navigation.navigate(SCREENS.LOGINSCREEN);
      }
      setLoading(false);
    } catch (error) {
      setIsLoggedIn(false);
      setLoading(false);
      console.error('Error al recuperar tus datos:', error.message);
      navigation.navigate(SCREENS.LOGINSCREEN);
    }
  };

  // Cargar las ciudades desde la API
  const fetchCities = async () => {
    try {
      if (!API_BASE_URL) {
        throw new Error('API_BASE_URL is not defined');
      }
      const url = `${API_BASE_URL}/locations/cities`;
      console.log('Fetching cities from:', url);
      const response = await axios.get(url);
      console.log('Cities response:', response.data);
      setCities(response.data);
    } catch (error) {
      console.error('Error al obtener ciudades:', {
        message: error.message,
        config: error.config,
        response: error.response,
      });
      Alert.alert('Error', 'No se pudieron cargar las ciudades.');
    }
  };

  useEffect(() => {
    checkExistingUser();
    fetchCities();
  }, []);

  // Manejar la selección de una ciudad
  const handleSelectCity = async city => {
    try {
      if (!API_BASE_URL) {
        throw new Error('API_BASE_URL is not defined');
      }
      console.log('Updating city for userId:', userId, 'City:', city);
      const url = `${API_BASE_URL}/user/${userId}`;
      const payload = {ciudad: {id: city._id, name: city.name}};
      console.log('PUT request to:', url, 'Payload:', payload);
      const response = await axios.put(url, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Update response:', response.data);

      const updatedUserData = {
        ...userData,
        ciudad: {id: city._id, name: city.name},
      };
      await AsyncStorage.setItem(
        `user${userId}`,
        JSON.stringify(updatedUserData),
      );
      setUserData(updatedUserData);

      // Guardar la ciudad seleccionada en AsyncStorage como selectedAddress
      const addressData = {
        _id: city._id,
        city: city.name,
        street: '',
        state: '',
        country: '',
        postalCode: '',
      };
      await AsyncStorage.setItem(
        'selectedAddress',
        JSON.stringify(addressData),
      );

      // Navegar de vuelta a la pantalla de origen con parámetros
      navigation.navigate(returnScreen, {
        addressId: city._id,
        addressDetails: city.name,
      });

      Alert.alert('Éxito', 'Ubicación actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la ubicación:', {
        message: error.message,
        config: error.config,
        response: error.response,
      });
      Alert.alert(
        'Error',
        'No se pudo actualizar la ubicación. Por favor, intenta de nuevo más tarde.',
      );
    }
  };

  const renderCityItem = ({item}) => (
    <TouchableOpacity
      style={styles.cityItem}
      onPress={() => handleSelectCity(item)}>
      <Text style={styles.cityText}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeftIcon
            name={ICONS.CHEVRON_LEFT.name}
            size={ICONS.CHEVRON_LEFT.size}
            color={COLORS.GREEN}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Seleccionar ciudad</Text>
      </View>

      <FlatList
        data={cities}
        renderItem={renderCityItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No se encontraron ciudades disponibles.
          </Text>
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default SelectCityScreen;
