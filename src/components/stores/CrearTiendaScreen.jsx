import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import {API_BASE_URL} from '../../config/Service.Config';
import {COLORS, ICONS} from '../../constants';
import styles from './styles/CrearTiendaScreenStyle';
import SCREENS from '../../screens';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  MaterialCommunityIcons:
    require('react-native-vector-icons/MaterialCommunityIcons').default,
};

const CrearTiendaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone_number: '',
    address: '',
    specific_location: '',
    owner: '',
  });
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingStore, setExistingStore] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const SaveIcon = IconComponents[ICONS.SAVE.library];
  // Función para verificar la existencia de una tienda
  const checkStore = async (userId, forceFetch = false) => {
    try {
      if (!forceFetch) {
        const storedData = await AsyncStorage.getItem('store_data');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (
            parsedData &&
            parsedData.id &&
            parsedData.name &&
            parsedData.description &&
            parsedData.phone_number &&
            parsedData.address &&
            parsedData.specific_location &&
            parsedData.owner === userId
          ) {
            setExistingStore(parsedData);
            setIsLoading(false);
            return;
          }
        }
      }

      const response = await axios.get(
        `${API_BASE_URL}/tienda/owner/${userId}`,
      );
      if (response.data) {
        const storeData = {
          id: response.data._id,
          name: response.data.name,
          description: response.data.description,
          phone_number: response.data.phone_number,
          address: response.data.address?.name || '',
          specific_location: response.data.specific_location,
          owner: userId,
          ownerName: response.data.owner?.userName || userName || '',
          logo: response.data.logo?.url,
          banner: response.data.banner?.url,
        };
        setExistingStore(storeData);
        await AsyncStorage.setItem('store_data', JSON.stringify(storeData));
      } else {
        setExistingStore(null);
        await AsyncStorage.removeItem('store_data');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setExistingStore(null);
        await AsyncStorage.removeItem('store_data');
      } else if (error.response?.status === 400) {
        Alert.alert('Error', 'El ID del usuario no es válido.');
        await AsyncStorage.removeItem('id');
        navigation.navigate('Login');
      } else {
        console.error('Error al verificar tienda:', error);
        Alert.alert(
          'Error',
          'No se pudo verificar si tienes una tienda. Intenta de nuevo.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar userId y datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const id = await AsyncStorage.getItem('id');
        if (!id) {
          Alert.alert('Error', 'Debes iniciar sesión para crear una tienda.');
          navigation.navigate('Login');
          return;
        }
        const parsedId = JSON.parse(id);
        if (!parsedId || typeof parsedId !== 'string') {
          await AsyncStorage.removeItem('id');
          Alert.alert(
            'Error',
            'Sesión inválida. Por favor, inicia sesión de nuevo.',
          );
          navigation.navigate('Login');
          return;
        }
        setUserId(parsedId);
        setFormData(prev => ({...prev, owner: parsedId}));

        const userData = await AsyncStorage.getItem(`user${parsedId}`);
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserName(parsedUserData.userName || '');
          if (parsedUserData?.ciudad?.name) {
            setFormData(prev => ({
              ...prev,
              address: parsedUserData.ciudad.name,
            }));
          }
        } else {
          Alert.alert('Error', 'Datos de usuario no encontrados.');
          navigation.navigate('Login');
          return;
        }

        await checkStore(parsedId);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos iniciales.');
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Verificar tienda cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        setIsLoading(true);
        checkStore(userId, params?.storeDeleted === 'true');
      }
    }, [userId, userName, params?.storeDeleted]),
  );

  // Verificar si la tienda fue eliminada
  useEffect(() => {
    if (params?.storeDeleted === 'true') {
      setExistingStore(null);
      AsyncStorage.removeItem('store_data');
    }
  }, [params?.storeDeleted]);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const pickImage = async type => {
    if (type === 'logo' && logo) {
      Alert.alert('Límite alcanzado', 'Solo se permite subir un logo.');
      return;
    }
    if (type === 'banner' && banner) {
      Alert.alert('Límite alcanzado', 'Solo se permite subir un banner.');
      return;
    }

    const options = {
      mediaType: 'photo',
      maxWidth: type === 'logo' ? 512 : 1024,
      maxHeight: type === 'logo' ? 512 : 256,
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        console.error('Error al seleccionar imagen:', response.errorMessage);
        Alert.alert(
          'Error',
          `No se pudo seleccionar la imagen: ${response.errorMessage}`,
        );
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (type === 'logo') {
          setLogo(uri);
        } else {
          setBanner(uri);
        }
      }
    });
  };

  const removeImage = type => {
    if (type === 'logo') {
      setLogo(null);
    } else {
      setBanner(null);
    }
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!formData.name) missingFields.push('Nombre');
    if (!formData.description) missingFields.push('Descripción');
    if (!formData.phone_number) missingFields.push('Teléfono');
    if (!formData.address) missingFields.push('Dirección');
    if (!formData.specific_location) missingFields.push('Ubicación específica');
    if (!formData.owner) missingFields.push('Propietario');
    if (!logo) missingFields.push('Logo');
    if (!banner) missingFields.push('Banner');

    if (missingFields.length > 0) {
      Alert.alert(
        'Campos obligatorios',
        `Los siguientes campos son requeridos: ${missingFields.join(', ')}`,
      );
      return;
    }

    setLoading(true);

    try {
      const userData = await AsyncStorage.getItem(`user${userId}`);
      if (!userData) {
        throw new Error('Datos de usuario no encontrados.');
      }
      const parsedUserData = JSON.parse(userData);
      const addressId = parsedUserData?.ciudad?.id;
      if (!addressId) {
        throw new Error('No se ha seleccionado una ciudad válida.');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('address', addressId);
      formDataToSend.append('specific_location', formData.specific_location);
      formDataToSend.append('owner', userId);

      if (logo) {
        formDataToSend.append('logo', {
          uri: logo,
          name: `logo_${userId}.jpg`,
          type: 'image/jpeg',
        });
      }
      if (banner) {
        formDataToSend.append('banner', {
          uri: banner,
          name: `banner_${userId}.jpg`,
          type: 'image/jpeg',
        });
      }

      const response = await axios.post(
        `${API_BASE_URL}/tienda`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const storeData = {
        id: response.data.tienda._id,
        name: formData.name,
        description: formData.description,
        phone_number: formData.phone_number,
        address: formData.address,
        specific_location: formData.specific_location,
        owner: userId,
        ownerName: userName,
        logo: response.data.tienda.logo.url,
        banner: response.data.tienda.banner.url,
      };
      await AsyncStorage.setItem('store_data', JSON.stringify(storeData));
      setExistingStore(storeData);

      setFormData({
        name: '',
        description: '',
        phone_number: '',
        address: formData.address,
        specific_location: '',
        owner: userId,
      });
      setLogo(null);
      setBanner(null);

      Alert.alert('Éxito', 'Tienda creada correctamente');
    } catch (error) {
      console.error(
        'Error al crear tienda:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'No se pudo crear la tienda. Intenta de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Componente para mostrar los detalles de la tienda
  const StoreCard = ({store}) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate(SCREENS.EDITAR_STORE_DETAILS, {
          store: JSON.stringify(store),
        })
      }>
      <Text style={styles.cardTitle}>{store.name}</Text>
      {store.banner && (
        <Image source={{uri: store.banner}} style={styles.bannerPreview} />
      )}
      {store.logo && (
        <Image source={{uri: store.logo}} style={styles.imagePreview} />
      )}
      <Text style={styles.cardLabel}>Propietario:</Text>
      <Text style={styles.cardText}>{store.ownerName}</Text>
      <Text style={styles.cardLabel}>Descripción:</Text>
      <Text style={styles.cardText}>{store.description}</Text>
      <Text style={styles.cardLabel}>Teléfono:</Text>
      <Text style={styles.cardText}>{store.phone_number}</Text>
      <Text style={styles.cardLabel}>Dirección:</Text>
      <Text style={styles.cardText}>{store.address}</Text>
      <Text style={styles.cardLabel}>Ubicación específica:</Text>
      <Text style={styles.cardText}>{store.specific_location}</Text>
    </TouchableOpacity>
  );

  // Mostrar loader centrado mientras se verifica
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Renderizar StoreCard si existe una tienda
  if (existingStore) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconComponents.MaterialIcons
              name={ICONS.CHEVRON_LEFT.name}
              size={ICONS.CHEVRON_LEFT.size}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Detalles de la Tienda</Text>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <StoreCard store={existingStore} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Renderizar formulario si no hay tienda
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconComponents.MaterialIcons
            name={ICONS.CHEVRON_LEFT.name}
            size={ICONS.CHEVRON_LEFT.size}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Crear Nueva Tienda</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Propietario*</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={userName}
            editable={false}
            placeholder="Nombre del propietario"
            placeholderTextColor={COLORS.placeholder}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de la tienda*</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={text => handleChange('name', text)}
            placeholder="Ej: GD Tienda"
            placeholderTextColor={COLORS.placeholder}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción*</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.description}
            onChangeText={text => handleChange('description', text)}
            placeholder="Describe tu tienda"
            placeholderTextColor={COLORS.placeholder}
            multiline
            numberOfLines={4}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono de contacto*</Text>
          <TextInput
            style={styles.input}
            value={formData.phone_number}
            onChangeText={text => handleChange('phone_number', text)}
            placeholder="Ej: +24022255555"
            placeholderTextColor={COLORS.placeholder}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección*</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={formData.address}
            editable={false}
            placeholder="Guinea Ecuatorial"
            placeholderTextColor={COLORS.placeholder}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Ubicación específica (barrio, calle, zona)*
          </Text>
          <TextInput
            style={styles.input}
            value={formData.specific_location}
            onChangeText={text => handleChange('specific_location', text)}
            placeholder="Ej: Barrio Central, Calle Principal"
            placeholderTextColor={COLORS.placeholder}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Logo de la tienda*</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage('logo')}>
            {logo ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{uri: logo}}
                  style={styles.imagePreview}
                  key={logo}
                  onError={e => {
                    console.error('Error cargando logo:', e.nativeEvent.error);
                    Alert.alert('Error', 'No se pudo cargar el logo.');
                  }}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeImage('logo')}>
                  <IconComponents.MaterialIcons
                    name={ICONS.DELETE.name}
                    size={ICONS.DELETE.size}
                    color={COLORS.red}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <IconComponents.MaterialIcons
                  name={ICONS.IMAGE.name}
                  size={ICONS.IMAGE.size}
                  color={COLORS.placeholder}
                />
                <Text style={styles.imagePickerText}>
                  Seleccionar Logo (1:1)
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Banner de la tienda*</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage('banner')}>
            {banner ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{uri: banner}}
                  style={styles.bannerPreview}
                  key={banner}
                  onError={e => {
                    console.error(
                      'Error cargando banner:',
                      e.nativeEvent.error,
                    );
                    Alert.alert('Error', 'No se pudo cargar el banner.');
                  }}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeImage('banner')}>
                  <IconComponents.MaterialIcons
                    name={ICONS.DELETE.name}
                    size={ICONS.DELETE.size}
                    color={COLORS.red}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <IconComponents.MaterialIcons
                  name={ICONS.PANORAMA.name}
                  size={ICONS.PANORAMA.size}
                  color={COLORS.placeholder}
                />
                <Text style={styles.imagePickerText}>
                  Seleccionar Banner (4:1)
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          <SaveIcon
            name={ICONS.SAVE.name}
            size={ICONS.SAVE.size}
            color={COLORS.white}
          />
          <Text style={styles.submitButtonText}>
            {loading ? 'Creando...' : 'Crear Tienda'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CrearTiendaScreen;
