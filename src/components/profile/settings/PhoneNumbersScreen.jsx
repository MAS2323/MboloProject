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

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
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
  const AddIcon = IconComponents[ICONS.ADD.library];

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    zIndex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButtonText: {
    fontSize: 16,
    color: COLORS.black,
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B0BEC5',
    borderRadius: 5,
    padding: 12,
    marginBottom: 5,
    backgroundColor: '#F5F5F5',
  },
  currentPhoneText: {
    fontSize: 16,
    color: COLORS.black,
  },
  confirmedText: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
