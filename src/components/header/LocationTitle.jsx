import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import styles from './styles/Header.styles';
import SCREENS from '../../screens';

const LocationTitle = ({title = 'Guinea Ecuatorial'}) => {
  const [city, setCity] = useState(title);
  const navigation = useNavigation();

  // Cargar la ciudad desde AsyncStorage
  const loadCity = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      if (id) {
        const parsedId = JSON.parse(id);
        const userKey = `user${parsedId}`;
        const userData = await AsyncStorage.getItem(userKey);
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          const cityName = parsedUserData.ciudad?.name || title;
          setCity(cityName);
        }
      }
    } catch (error) {
      console.error('Error loading city:', error.message);
      setCity(title); // Fallback al título por defecto
    }
  };

  useEffect(() => {
    loadCity();
    // Escuchar cambios en la pantalla (cuando vuelve de SelectCityScreen)
    const unsubscribe = navigation.addListener('focus', () => {
      loadCity();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(SCREENS.SELECT_CITY_SCREEN)}>
      <Text style={styles.locationTitle}>{city}</Text>
    </TouchableOpacity>
  );
};

export default LocationTitle;
