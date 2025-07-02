import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '../../../config/Service.Config';
import {useNavigation} from '@react-navigation/native';
import {COLORS, ICONS} from '../../../constants';
import styles from './styles/PhoneNumbersScree';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  Ionicons: require('react-native-vector-icons/Ionicons').default,
};

const PhoneNumbersScreen = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [mobile, setMobile] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAddingNumber, setIsAddingNumber] = useState(false);

  const navigation = useNavigation();

  // Declarar los iconos
  const ChevronLeftIcon = IconComponents[ICONS.CHEVRON_LEFT.library];
  const CheckCircleIcon = IconComponents[ICONS.CHECK_CIRCLE.library];
  const AddIcon = IconComponents[ICONS.ADD_NUMBER.library];

  // Verificar usuario existente y cargar datos desde AsyncStorage
  const checkExistingUser = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      if (!id) {
        navigation.navigate('Login');
        return;
      }
      const userId = `user${JSON.parse(id)}`;
      const currentUser = await AsyncStorage.getItem(userId);
      if (currentUser) {
        const parsedUserData = JSON.parse(currentUser);
        setUserData(parsedUserData);
        setUserId(JSON.parse(id));
        setMobile(parsedUserData.mobile || '');
        setIsLoggedIn(true);
      } else {
        navigation.navigate('Login');
      }
      setLoading(false);
    } catch (error) {
      setIsLoggedIn(false);
      setLoading(false);
      console.error('Error al recuperar tus datos:', error);
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    checkExistingUser();
  }, []);

  // Validar formato de número de teléfono (básico)
  const validatePhoneNumber = phone => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  // Añadir o actualizar el número de teléfono
  const handleAddPhoneNumber = async () => {
    if (!newPhoneNumber) {
      Alert.alert('Error', 'Por favor, ingresa un número de teléfono');
      return;
    }

    if (!validatePhoneNumber(newPhoneNumber)) {
      Alert.alert('Error', 'Por favor, ingresa un número de teléfono válido');
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/user/${userId}`,
        {mobile: newPhoneNumber},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const updatedUserData = {
        ...userData,
        mobile: newPhoneNumber,
      };
      await AsyncStorage.setItem(
        `user${userId}`,
        JSON.stringify(updatedUserData),
      );
      setUserData(updatedUserData);
      setMobile(newPhoneNumber);
      setNewPhoneNumber('');
      setIsAddingNumber(false);

      Alert.alert('Éxito', 'Número de teléfono actualizado correctamente');
    } catch (error) {
      console.error(
        'Error al actualizar el número de teléfono:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        'No se pudo actualizar el número de teléfono. Por favor, intenta de nuevo más tarde.',
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  if (isAddingNumber) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsAddingNumber(false)}>
            <ChevronLeftIcon
              name={ICONS.CHEVRON_LEFT.name}
              size={ICONS.CHEVRON_LEFT.size}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Añadir número de teléfono</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Número de teléfono</Text>
          <TextInput
            style={styles.input}
            value={newPhoneNumber}
            onChangeText={setNewPhoneNumber}
            placeholder="Ingresa tu número de teléfono"
            keyboardType="phone-pad"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddPhoneNumber}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeftIcon
            name={ICONS.CHEVRON_LEFT.name}
            size={ICONS.CHEVRON_LEFT.size}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Número de teléfono</Text>
      </View>

      <View style={styles.formContainer}>
        {mobile ? (
          <>
            <Text style={styles.label}>Tu número de teléfono</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currentPhoneText}>{mobile}</Text>
              <CheckCircleIcon
                name={ICONS.CHECK_CIRCLE.name}
                size={ICONS.CHECK_CIRCLE.size}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.confirmedText}>Confirmado</Text>

            <Text style={styles.label}>Nuevo número de teléfono</Text>
            <TextInput
              style={styles.input}
              value={newPhoneNumber}
              onChangeText={setNewPhoneNumber}
              placeholder="Ingresa tu nuevo número de teléfono"
              keyboardType="phone-pad"
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddPhoneNumber}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddingNumber(true)}>
            <AddIcon
              name={ICONS.ADD.name}
              size={ICONS.ADD.size}
              color={COLORS.primary}
            />
            <Text style={styles.addButtonText}>Añadir número de teléfono</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PhoneNumbersScreen;
