import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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

// Componente reutilizable para campos de entrada
const InputField = ({label, value, placeholder, onPress, editable}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <TextInput
        style={[styles.input, !editable && styles.disabledInput]}
        value={value}
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
      />
    </TouchableOpacity>
  </View>
);

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  MaterialCommunityIcons:
    require('react-native-vector-icons/MaterialCommunityIcons').default,
};

const PAYMENT_METHODS = [
  {name: 'EcoBank', key: 'EcoBank'},
  {name: 'BGFBank', key: 'BGFBank'},
  {name: 'Muni-Dinero', key: 'Muni-Dinero'},
];

const DOCUMENT_TYPES = [
  {name: 'DIP', key: 'DIP'},
  {name: 'Pasaporte', key: 'Pasaporte'},
  {name: 'Permiso de Residencia', key: 'Permiso de Residencia'},
];

const CrearTiendaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone_number: '',
    address: '', // Nombre de la ciudad para visualización
    cityId: '', // ID de la ciudad para el backend
    specific_location: '',
    owner: '',
  });
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [documents, setDocuments] = useState([]); // Cambiado a array para múltiples documentos
  const [documentType, setDocumentType] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [accountNumbers, setAccountNumbers] = useState({});
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
          documents: response.data.documents || [], // Cambiado a array para documentos
          paymentMethods: response.data.paymentMethods || [],
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
        navigation.navigate(SCREENS.LOGIN);
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
          navigation.navigate(SCREENS.LOGIN);
          return;
        }
        const parsedId = JSON.parse(id);
        if (!parsedId || typeof parsedId !== 'string') {
          await AsyncStorage.removeItem('id');
          Alert.alert(
            'Error',
            'Sesión inválida. Por favor, inicia sesión de nuevo.',
          );
          navigation.navigate(SCREENS.LOGIN);
          return;
        }
        setUserId(parsedId);
        setFormData(prev => ({...prev, owner: parsedId}));

        const userData = await AsyncStorage.getItem(`user${parsedId}`);
        if (!userData) {
          Alert.alert('Error', 'Datos de usuario no encontrados.');
          navigation.navigate(SCREENS.LOGIN);
          return;
        }
        const parsedUserData = JSON.parse(userData);
        setUserName(parsedUserData.userName || '');
        if (!parsedUserData?.ciudad?.id || !parsedUserData?.ciudad?.name) {
          Alert.alert(
            'Error',
            'No se encontró una ciudad válida en los datos del usuario.',
          );
          navigation.navigate(SCREENS.PROFILE);
          return;
        }
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(
          parsedUserData.ciudad.id,
        );
        if (!isValidObjectId) {
          Alert.alert('Error', 'El ID de la ciudad del usuario no es válido.');
          navigation.navigate(SCREENS.PROFILE);
          return;
        }
        setFormData(prev => ({
          ...prev,
          address: parsedUserData.ciudad.name,
          cityId: parsedUserData.ciudad.id,
        }));

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

  // Manejar la selección de la ciudad
  const handleCitySelect = selectedCity => {
    console.log('Ciudad seleccionada:', selectedCity);
    if (!selectedCity?.id || !selectedCity?.name) {
      Alert.alert('Error', 'La ciudad seleccionada no es válida.');
      return;
    }
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(selectedCity.id);
    if (!isValidObjectId) {
      Alert.alert('Error', 'El ID de la ciudad seleccionada no es válido.');
      return;
    }
    setFormData({
      ...formData,
      address: selectedCity.name,
      cityId: selectedCity.id,
    });
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const selectDocumentType = typeKey => {
    setDocumentType(typeKey);
  };

  const togglePaymentMethod = methodKey => {
    setPaymentMethods(prev =>
      prev.includes(methodKey)
        ? prev.filter(key => key !== methodKey)
        : [...prev, methodKey],
    );
    if (paymentMethods.includes(methodKey)) {
      setAccountNumbers(prev => {
        const newAccountNumbers = {...prev};
        delete newAccountNumbers[methodKey];
        return newAccountNumbers;
      });
    }
  };

  const handleAccountNumberChange = (methodKey, value) => {
    setAccountNumbers(prev => ({
      ...prev,
      [methodKey]: value,
    }));
  };

  const pickImage = async type => {
    const imageStates = {
      logo: {current: logo, setter: setLogo, max: 1},
      banner: {current: banner, setter: setBanner, max: 1},
      documents: {current: documents, setter: setDocuments, max: 2}, // Cambiado para permitir múltiples documentos
    };

    const {current, setter, max} = imageStates[type];
    if (current && current.length >= max) {
      Alert.alert(
        'Límite alcanzado',
        `Solo se permiten hasta ${max} ${
          type === 'documents' ? 'documentos' : type
        }.`,
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      maxWidth: type === 'logo' ? 512 : type === 'banner' ? 1024 : 800,
      maxHeight: type === 'logo' ? 512 : type === 'banner' ? 256 : 600,
      quality: 0.8,
      includeBase64: false,
      selectionLimit: type === 'documents' ? max - current.length : 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log(`Selección de ${type} cancelada`);
        return;
      }
      if (response.errorCode) {
        console.error(`Error al seleccionar ${type}:`, response.errorMessage);
        Alert.alert(
          'Error',
          `No se pudo seleccionar la imagen: ${response.errorMessage}`,
        );
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const uris = response.assets.map(asset => asset.uri);
        console.log(`Imágenes seleccionadas para ${type}:`, uris);
        if (type === 'documents') {
          setter([...current, ...uris].slice(0, max));
        } else {
          setter(uris[0]);
        }
      } else {
        console.log(`No se seleccionó ninguna imagen para ${type}`);
      }
    });
  };

  const removeImage = (type, index = null) => {
    if (type === 'logo') {
      setLogo(null);
    } else if (type === 'banner') {
      setBanner(null);
    } else if (type === 'documents' && index !== null) {
      setDocuments(documents.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!formData.name) missingFields.push('Nombre');
    if (!formData.description) missingFields.push('Descripción');
    if (!formData.phone_number) missingFields.push('Teléfono');
    if (!formData.cityId) missingFields.push('Dirección');
    if (!formData.specific_location) missingFields.push('Ubicación específica');
    if (!formData.owner) missingFields.push('Propietario');
    if (!logo) missingFields.push('Logo');
    if (!banner) missingFields.push('Banner');
    if (documents.length === 0) missingFields.push('Documento');
    if (!documentType) missingFields.push('Tipo de documento');
    paymentMethods.forEach(method => {
      if (!accountNumbers[method]) {
        missingFields.push(`Número de cuenta para ${method}`);
      }
    });

    if (missingFields.length > 0) {
      Alert.alert(
        'Campos obligatorios',
        `Los siguientes campos son requeridos: ${missingFields.join(', ')}`,
      );
      return;
    }

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(formData.cityId);
    if (!isValidObjectId) {
      Alert.alert('Error', 'El ID de la ciudad no es válido.');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('address', formData.cityId);
      formDataToSend.append('specific_location', formData.specific_location);
      formDataToSend.append('owner', userId);
      formDataToSend.append('documentType', documentType);
      formDataToSend.append(
        'paymentMethods',
        JSON.stringify(
          paymentMethods.map(method => ({
            name: method,
            accountNumber: accountNumbers[method],
          })),
        ),
      );

      // Agregar logo
      if (logo) {
        formDataToSend.append('logo', {
          uri: logo,
          name: `logo_${userId}.jpg`,
          type: 'image/jpeg',
        });
      }

      // Agregar banner
      if (banner) {
        formDataToSend.append('banner', {
          uri: banner,
          name: `banner_${userId}.jpg`,
          type: 'image/jpeg',
        });
      }

      // Agregar documentos (ahora como array)
      documents.forEach((doc, index) => {
        formDataToSend.append('document', {
          // <-- Cambiado a singular
          uri: doc,
          name: `document_${userId}_${index}.jpg`,
          type: 'image/jpeg',
        });
      });
      console.log('Campos de texto:', {
        name: formData.name,
        description: formData.description,
        phone_number: formData.phone_number,
        address: formData.cityId,
        specific_location: formData.specific_location,
        owner: userId,
        documentType,
      });
      console.log(
        'Métodos de pago:',
        paymentMethods.map(method => ({
          name: method,
          accountNumber: accountNumbers[method],
        })),
      );
      console.log('Archivos:', {
        logo: logo ? `logo_${userId}.jpg` : null,
        banner: banner ? `banner_${userId}.jpg` : null,
        documents: documents.map((_, i) => `document_${userId}_${i}.jpg`),
      });

      const response = await axios.post(
        `${API_BASE_URL}/tienda`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
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
        documents: response.data.tienda.documents || [],
        paymentMethods: response.data.tienda.paymentMethods || [],
      };
      await AsyncStorage.setItem('store_data', JSON.stringify(storeData));
      setExistingStore(storeData);

      // Resetear formulario
      setFormData({
        name: '',
        description: '',
        phone_number: '',
        address: '',
        cityId: '',
        specific_location: '',
        owner: userId,
      });
      setLogo(null);
      setBanner(null);
      setDocuments([]);
      setDocumentType('');
      setPaymentMethods([]);
      setAccountNumbers({});

      Alert.alert('Éxito', 'Tienda creada correctamente');
    } catch (error) {
      console.error(
        'Error al crear tienda:',
        error.response?.data || error.message,
      );
      let errorMessage = 'No se pudo crear la tienda. Intenta de nuevo.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.field) {
          errorMessage += ` (Campo: ${error.response.data.field})`;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Componente para mostrar los detalles de la tienda
  const StoreCard = ({store}) => {
    const navigation = useNavigation();

    // Log store.document to debug
    console.log('StoreCard store.document:', store.document);

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() =>
          navigation.navigate(SCREENS.EDITAR_STORE_DETAILS, {
            store: JSON.stringify(store),
          })
        }>
        <Text style={styles.cardTitle}>{store.name || 'Sin nombre'}</Text>
        {store.banner?.url ? (
          <Image
            source={{uri: store.banner.url}}
            style={styles.bannerPreview}
            onError={e => {
              console.error('Error cargando banner:', e.nativeEvent.error);
              Alert.alert('Error', 'No se pudo cargar el banner de la tienda.');
            }}
          />
        ) : (
          <Text style={styles.cardText}>Banner no disponible</Text>
        )}
        {store.logo?.url ? (
          <Image
            source={{uri: store.logo.url}}
            style={styles.imagePreview}
            onError={e => {
              console.error('Error cargando logo:', e.nativeEvent.error);
              Alert.alert('Error', 'No se pudo cargar el logo de la tienda.');
            }}
          />
        ) : (
          <Text style={styles.cardText}>Logo no disponible</Text>
        )}
        <Text style={styles.cardLabel}>Propietario:</Text>
        <Text style={styles.cardText}>{store.ownerName || 'Desconocido'}</Text>
        <Text style={styles.cardLabel}>Descripción:</Text>
        <Text style={styles.cardText}>
          {store.description || 'Sin descripción'}
        </Text>
        <Text style={styles.cardLabel}>Teléfono:</Text>
        <Text style={styles.cardText}>
          {store.phone_number || 'Sin teléfono'}
        </Text>
        <Text style={styles.cardLabel}>Dirección:</Text>
        <Text style={styles.cardText}>
          {store.address?.name || 'Sin dirección'}
        </Text>
        <Text style={styles.cardLabel}>Ubicación específica:</Text>
        <Text style={styles.cardText}>
          {store.specific_location || 'Sin ubicación'}
        </Text>
        <Text style={styles.cardLabel}>Documentos:</Text>
        {store.document && store.document.length > 0 ? (
          store.document.map((doc, index) => (
            <View key={index} style={styles.documentItem}>
              <Text style={styles.cardText}>
                Tipo: {doc.type || 'Desconocido'}
              </Text>
              {doc.url ? (
                <Image
                  source={{uri: doc.url}}
                  style={styles.documentPreview}
                  onError={e => {
                    console.error(
                      `Error cargando documento ${index}:`,
                      e.nativeEvent.error,
                    );
                    Alert.alert(
                      'Error',
                      `No se pudo cargar la imagen del documento ${
                        doc.type || index + 1
                      }`,
                    );
                  }}
                />
              ) : (
                <Text style={styles.cardText}>Imagen no disponible</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.cardText}>No hay documentos</Text>
        )}
        <Text style={styles.cardLabel}>Métodos de pago:</Text>
        <View style={styles.paymentMethodsContainer}>
          {store.paymentMethods && store.paymentMethods.length > 0 ? (
            store.paymentMethods.map((method, index) => (
              <View key={index} style={styles.paymentMethodItem}>
                <Text style={styles.cardText}>
                  {method.name || 'Desconocido'}
                </Text>
                <Text style={styles.cardText}>
                  Cuenta: {method.accountNumber || 'Sin número'}
                </Text>
                {method.image?.url ? (
                  <Image
                    source={{uri: method.image.url}}
                    style={styles.paymentMethodImage}
                    onError={e => {
                      console.error(
                        `Error cargando imagen de ${method.name}:`,
                        e.nativeEvent.error,
                      );
                    }}
                  />
                ) : (
                  <Text style={styles.cardText}>Imagen no disponible</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.cardText}>
              No hay métodos de pago seleccionados
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

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
        <InputField
          label="Dirección*"
          value={formData.address || ''}
          placeholder="Seleccionar ciudad"
          onPress={() =>
            navigation.navigate(SCREENS.SELECT_CITY_SCREEN, {
              onSelect: handleCitySelect,
            })
          }
          editable={false}
        />
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
          <Text style={styles.label}>Tipo de documento*</Text>
          <View style={styles.documentTypesContainer}>
            {DOCUMENT_TYPES.map(type => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.documentTypeButton,
                  documentType === type.key &&
                    styles.documentTypeButtonSelected,
                ]}
                onPress={() => selectDocumentType(type.key)}
                disabled={loading}>
                <Text style={styles.documentTypeText}>{type.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Documentos (DIP, Pasaporte o Permiso de Residencia, hasta 2
            imágenes)*
          </Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage('documents')}
            disabled={loading || documents.length >= 2}>
            {documents.length > 0 ? (
              <View style={styles.imageContainer}>
                {documents.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <Image
                      source={{uri: doc}}
                      style={styles.documentPreview}
                      onError={e => {
                        console.error(
                          'Error cargando documento:',
                          e.nativeEvent.error,
                        );
                        Alert.alert('Error', 'No se pudo cargar el documento.');
                      }}
                    />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeImage('documents', index)}
                      disabled={loading}>
                      <IconComponents.MaterialIcons
                        name={ICONS.DELETE.name}
                        size={ICONS.DELETE.size}
                        color={COLORS.red}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
                {documents.length < 2 && (
                  <Text style={styles.imagePickerText}>
                    Añadir otro documento
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <IconComponents.MaterialIcons
                  name={ICONS.IMAGE.name}
                  size={ICONS.IMAGE.size}
                  color={COLORS.placeholder}
                />
                <Text style={styles.imagePickerText}>
                  Seleccionar Documento
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Métodos de pago*</Text>
          <View style={styles.paymentMethodsContainer}>
            {PAYMENT_METHODS.map(method => (
              <View key={method.key} style={styles.paymentMethodItem}>
                <TouchableOpacity
                  style={[
                    styles.paymentMethodButton,
                    paymentMethods.includes(method.key) &&
                      styles.paymentMethodButtonSelected,
                  ]}
                  onPress={() => togglePaymentMethod(method.key)}
                  disabled={loading}>
                  <Text style={styles.paymentMethodText}>{method.name}</Text>
                </TouchableOpacity>
                {paymentMethods.includes(method.key) && (
                  <TextInput
                    style={[styles.input, styles.accountNumberInput]}
                    value={accountNumbers[method.key] || ''}
                    onChangeText={text =>
                      handleAccountNumberChange(method.key, text)
                    }
                    placeholder={`Número de cuenta para ${method.name}`}
                    placeholderTextColor={COLORS.placeholder}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                )}
              </View>
            ))}
          </View>
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
