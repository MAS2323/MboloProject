import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, View, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '../../../../config/Service.Config';
import {ICONS, COLORS} from '../../../../constants';
import SCREENS from '../../../../screens';
import {useNavigation} from '@react-navigation/native';
import styles from './styles/SelectSexScreenStyle';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};

const SelectSexScreen = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigation = useNavigation();
  const ChevronLeftIcon = IconComponents[ICONS.CHEVRON_LEFT.library];

  // Verificar usuario existente y cargar datos desde AsyncStorage
  const checkExistingUser = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      if (!id) {
        navigation.navigate(SCREENS.LOGINSCREEN);
        return;
      }
      const parsedId = JSON.parse(id);
      console.log('ID almacenado en AsyncStorage:', parsedId);
      const userKey = `user${parsedId}`;
      const currentUser = await AsyncStorage.getItem(userKey);
      if (currentUser) {
        const parsedUserData = JSON.parse(currentUser);
        setUserData(parsedUserData);
        setUserId(parsedId);
        setIsLoggedIn(true);
      } else {
        navigation.navigate(SCREENS.LOGINSCREEN);
      }
      setLoading(false);
    } catch (error) {
      setIsLoggedIn(false);
      setLoading(false);
      console.error('Error al recuperar tus datos:', error);
      navigation.navigate(SCREENS.LOGINSCREEN);
    }
  };

  useEffect(() => {
    checkExistingUser();
  }, []);

  // Manejar la selección de sexo
  const handleSelectSex = async selectedSex => {
    try {
      console.log('Actualizando sexo para userId:', userId);
      const formData = new FormData();
      formData.append('sex', selectedSex);

      // Actualizar en el backend
      const response = await axios.put(
        `${API_BASE_URL}/user/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('Respuesta del backend:', response.data);

      // Actualizar en AsyncStorage
      const updatedUserData = {
        ...userData,
        sex: selectedSex,
      };
      await AsyncStorage.setItem(
        `user${userId}`,
        JSON.stringify(updatedUserData),
      );
      setUserData(updatedUserData);

      // Regresar a la pantalla anterior
      navigation.goBack();
    } catch (error) {
      console.error(
        'Error al actualizar el sexo:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        'No se pudo actualizar el sexo. Por favor, intenta de nuevo más tarde.',
      );
    }
  };

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
        <Text style={styles.headerText}>Seleccionar sexo</Text>
        <View style={{width: 30}} />
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleSelectSex('Masculino')}>
          <Text style={styles.optionText}>Masculino</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleSelectSex('Femenino')}>
          <Text style={styles.optionText}>Femenino</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleSelectSex('No especificar')}>
          <Text style={styles.optionText}>No especificar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SelectSexScreen;
