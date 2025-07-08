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
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '../../config/Service.Config';
import {COLORS, ICONS} from '../../constants';
import SCREENS from '../../screens';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  Feather: require('react-native-vector-icons/Feather').default,
  Ionicons: require('react-native-vector-icons/Ionicons').default,
};

// Métodos de pago disponibles
const PAYMENT_METHODS = [
  {name: 'EcoBank', key: 'EcoBank'},
  {name: 'BGFBank', key: 'BGFBank'},
  {name: 'Muni-Dinero', key: 'Muni-Dinero'},
];

// Tipos de documento
const DOCUMENT_TYPES = [
  {name: 'DIP', key: 'DIP'},
  {name: 'Pasaporte', key: 'Pasaporte'},
  {name: 'Permiso de Residencia', key: 'Permiso de Residencia'},
];

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
        placeholderTextColor={COLORS.PLACEHOLDER || '#A0A0A0'}
      />
    </TouchableOpacity>
  </View>
);

const EditarTiendaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const storeData = route.params?.store ? JSON.parse(route.params.store) : {};

  const [formData, setFormData] = useState({
    id: storeData.id || '',
    name: storeData.name || '',
    description: storeData.description || '',
    phone_number: storeData.phone_number || '',
    address: storeData.address || '', // Nombre de la ciudad para visualización
    cityId: '', // ID de la ciudad para el backend
    specific_location: storeData.specific_location || '',
    owner: storeData.owner || '',
    documentType: storeData.document?.type || '',
  });
  const [logo, setLogo] = useState(storeData.logo || null);
  const [banner, setBanner] = useState(storeData.banner || null);
  const [document, setDocument] = useState(storeData.document?.url || null);
  const [paymentMethods, setPaymentMethods] = useState(
    storeData.paymentMethods?.map(method => method.name) || [],
  );
  const [accountNumbers, setAccountNumbers] = useState(
    storeData.paymentMethods?.reduce((acc, method) => {
      acc[method.name] = method.accountNumber;
      return acc;
    }, {}) || {},
  );
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(storeData.ownerName || '');

  // Definir los íconos dinámicamente desde las constantes
  const BackIcon = IconComponents[ICONS.BACK.library || 'MaterialIcons'];
  const ImageIcon = IconComponents[ICONS.IMAGE.library || 'MaterialIcons'];
  const PanoramaIcon =
    IconComponents[ICONS.PANORAMA.library || 'MaterialIcons'];
  const DeleteIcon = IconComponents[ICONS.DELETE.library || 'MaterialIcons'];
  const UpdateIcon = IconComponents[ICONS.UPDATE.library || 'MaterialIcons'];
  const DeleteForeverIcon =
    IconComponents[ICONS.DELETE_FOREVER.library || 'MaterialIcons'];

  // Cargar userId y datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const id = await AsyncStorage.getItem('id');
        if (!id) {
          Alert.alert('Error', 'Debes iniciar sesión para editar la tienda.');
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
          cityId: parsedUserData.ciudad.id,
          address: parsedUserData.ciudad.name,
        }));

        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos iniciales.');
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

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
      logo: {current: logo, setter: setLogo},
      banner: {current: banner, setter: setBanner},
    };

    const {current, setter} = imageStates[type];
    if (current) {
      Alert.alert('Límite alcanzado', `Solo se permite subir un ${type}.`);
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 1,
      maxWidth: type === 'logo' ? 512 : 1024,
      maxHeight: type === 'logo' ? 512 : 256,
      includeBase64: false,
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
        const uri = response.assets[0].uri;
        console.log(`Imagen seleccionada para ${type}: ${uri}`);
        setter(uri);
      } else {
        console.log(`No se seleccionó ninguna imagen para ${type}`);
      }
    });
  };

  const removeImage = type => {
    if (type === 'logo') {
      setLogo(null);
    } else if (type === 'banner') {
      setBanner(null);
    }
  };

  const handleUpdate = async () => {
    const missingFields = [];
    if (!formData.name) missingFields.push('Nombre');
    if (!formData.description) missingFields.push('Descripción');
    if (!formData.phone_number) missingFields.push('Teléfono');
    if (!formData.cityId) missingFields.push('Dirección');
    if (!formData.specific_location) missingFields.push('Ubicación específica');
    if (!formData.owner) missingFields.push('Propietario');
    if (!logo) missingFields.push('Logo');
    if (!banner) missingFields.push('Banner');
    if (paymentMethods.length === 0) missingFields.push('Métodos de pago');
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

    if (!formData.id) {
      Alert.alert('Error', 'No se encontró el ID de la tienda.');
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
      formDataToSend.append(
        'paymentMethods',
        JSON.stringify(
          paymentMethods.map(method => ({
            name: method,
            accountNumber: accountNumbers[method],
          })),
        ),
      );

      if (logo && logo !== storeData.logo) {
        formDataToSend.append('logo', {
          uri: logo,
          name: `logo_${userId}.jpg`,
          type: 'image/jpeg',
        });
      }
      if (banner && banner !== storeData.banner) {
        formDataToSend.append('banner', {
          uri: banner,
          name: `banner_${userId}.jpg`,
          type: 'image/jpeg',
        });
      }

      console.log('Enviando FormData para actualizar:');
      console.log('Campos de texto:');
      [
        'name',
        'description',
        'phone_number',
        'address',
        'specific_location',
        'owner',
      ].forEach(field => {
        console.log(
          `${field}: ${
            formDataToSend._parts.find(part => part[0] === field)?.[1]
          }`,
        );
      });
      console.log(
        'Métodos de pago:',
        formDataToSend._parts.find(part => part[0] === 'paymentMethods')?.[1],
      );
      console.log('Archivos:');
      ['logo', 'banner'].forEach(field => {
        const fileData = formDataToSend._parts.find(
          part => part[0] === field,
        )?.[1];
        if (fileData) console.log(`${field}: ${JSON.stringify(fileData)}`);
      });

      const response = await axios.put(
        `${API_BASE_URL}/tienda/${formData.id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const updatedStore = {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        phone_number: formData.phone_number,
        address: formData.address,
        specific_location: formData.specific_location,
        owner: userId,
        ownerName: userName,
        logo: response.data.tienda.logo.url,
        banner: response.data.tienda.banner.url,
        document: {
          type: formData.documentType,
          url: response.data.tienda.document.url,
        },
        paymentMethods: response.data.tienda.paymentMethods || [],
      };
      await AsyncStorage.setItem('store_data', JSON.stringify(updatedStore));

      Alert.alert('Éxito', 'Tienda actualizada correctamente');
      navigation.navigate(SCREENS.EDITAR_STORE_DETAILS, {
        store: JSON.stringify(updatedStore),
      });
    } catch (error) {
      console.error(
        'Error al actualizar tienda:',
        error.response?.data || error.message,
      );
      let errorMessage = 'No se pudo actualizar la tienda. Intenta de nuevo.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) {
      Alert.alert('Error', 'No se encontró el ID de la tienda.');
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar la tienda? Esta acción no se puede deshacer.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${API_BASE_URL}/tienda/${formData.id}`);
              await AsyncStorage.removeItem('store_data');
              Alert.alert('Éxito', 'Tienda eliminada correctamente');
              navigation.navigate(SCREENS.CREAR_TIENDA, {storeDeleted: 'true'});
            } catch (error) {
              console.error(
                'Error al eliminar tienda:',
                error.response?.data || error.message,
              );
              let errorMessage =
                'No se pudo eliminar la tienda. Intenta de nuevo.';
              if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              }
              Alert.alert('Error', errorMessage);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY || '#00C853'} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon
            name={ICONS.BACK.name || 'chevron-left'}
            size={ICONS.BACK.size || 30}
            color={COLORS.PRIMARY || '#00C853'}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Editar Tienda</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Campo Propietario */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Propietario*</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={userName}
            editable={false}
            placeholder="Nombre del propietario"
            placeholderTextColor={COLORS.PLACEHOLDER || '#A0A0A0'}
          />
        </View>

        {/* Campo Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de la tienda*</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={text => handleChange('name', text)}
            placeholder="Ej: GD Tienda"
            placeholderTextColor={COLORS.PLACEHOLDER || '#A0A0A0'}
          />
        </View>

        {/* Campo Descripción */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción*</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.description}
            onChangeText={text => handleChange('description', text)}
            placeholder="Describe tu tienda"
            placeholderTextColor={COLORS.PLACEHOLDER || '#A0A0A0'}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Campo Teléfono */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono de contacto*</Text>
          <TextInput
            style={styles.input}
            value={formData.phone_number}
            onChangeText={text => handleChange('phone_number', text)}
            placeholder="Ej: +24022255555"
            placeholderTextColor={COLORS.PLACEHOLDER || '#A0A0A0'}
            keyboardType="phone-pad"
          />
        </View>

        {/* Campo Dirección */}
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

        {/* Campo Ubicación Específica */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Ubicación específica (barrio, calle, zona)*
          </Text>
          <TextInput
            style={styles.input}
            value={formData.specific_location}
            onChangeText={text => handleChange('specific_location', text)}
            placeholder="Ej: Barrio Central, Calle Principal"
            placeholderTextColor={COLORS.PLACEHOLDER || '#A0A0A0'}
          />
        </View>

        {/* Campo Tipo de Documento (No editable) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de documento*</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={formData.documentType}
            editable={false}
            placeholder="Tipo de documento"
            placeholderTextColor={COLORS.PLACEHOLDER || '#A0A0A0'}
          />
        </View>

        {/* Campo Documento (Solo visualización) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Documento*</Text>
          {document ? (
            <View style={styles.imageContainer}>
              <Image
                source={{uri: document}}
                style={styles.documentPreview}
                key={document}
                onError={e => {
                  console.error(
                    'Error cargando documento:',
                    e.nativeEvent.error,
                  );
                  Alert.alert('Error', 'No se pudo cargar el documento.');
                }}
              />
            </View>
          ) : (
            <Text style={styles.imagePickerText}>
              No se encontró el documento
            </Text>
          )}
        </View>

        {/* Métodos de Pago */}
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
                    placeholderTextColor={COLORS.PLACEHOLDER || '#A0A0A0'}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Subir Logo */}
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
                  <DeleteIcon
                    name={ICONS.DELETE.name || 'delete'}
                    size={ICONS.DELETE.size || 24}
                    color={COLORS.ERROR || '#FF0000'}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <ImageIcon
                  name={ICONS.IMAGE.name || 'image'}
                  size={ICONS.IMAGE.size || 40}
                  color={COLORS.PLACEHOLDER || '#A0A0A0'}
                />
                <Text style={styles.imagePickerText}>
                  Seleccionar Logo (1:1)
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Subir Banner */}
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
                  <DeleteIcon
                    name={ICONS.DELETE.name || 'delete'}
                    size={ICONS.DELETE.size || 24}
                    color={COLORS.ERROR || '#FF0000'}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <PanoramaIcon
                  name={ICONS.PANORAMA.name || 'panorama'}
                  size={ICONS.PANORAMA.size || 40}
                  color={COLORS.PLACEHOLDER || '#A0A0A0'}
                />
                <Text style={styles.imagePickerText}>
                  Seleccionar Banner (4:1)
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.updateButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleUpdate}
            disabled={loading}>
            <UpdateIcon
              name={ICONS.UPDATE.name || 'update'}
              size={ICONS.UPDATE.size || 24}
              color={COLORS.WHITE || '#FFFFFF'}
            />
            <Text style={styles.submitButtonText}>
              {loading ? 'Actualizando...' : 'Actualizar Tienda'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.deleteStoreButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleDelete}
            disabled={loading}>
            <DeleteForeverIcon
              name={ICONS.DELETE_FOREVER.name || 'delete-forever'}
              size={ICONS.DELETE_FOREVER.size || 24}
              color={COLORS.WHITE || '#FFFFFF'}
            />
            <Text style={styles.submitButtonText}>Eliminar Tienda</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE || '#fff',
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
    color: COLORS.BLACK || '#1A1A1A',
  },
  container: {
    padding: 15,
    paddingTop: 60,
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK || '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.WHITE || '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.BLACK || '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
  },
  disabledInput: {
    backgroundColor: COLORS.DISABLED || '#F5F5F5',
    color: COLORS.DISABLED_TEXT || '#666',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    borderRadius: 8,
    backgroundColor: COLORS.WHITE || '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    color: COLORS.SECONDARY || '#666',
    fontSize: 14,
    marginTop: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  bannerPreview: {
    width: '100%',
    aspectRatio: 4 / 1,
    resizeMode: 'contain',
  },
  documentPreview: {
    width: 150,
    height: 100,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: COLORS.WHITE || '#FFFFFF',
    borderRadius: 12,
    padding: 2,
  },
  paymentMethodsContainer: {
    marginTop: 10,
  },
  paymentMethodItem: {
    marginBottom: 10,
  },
  paymentMethodButton: {
    backgroundColor: COLORS.WHITE || '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentMethodButtonSelected: {
    backgroundColor: COLORS.PRIMARY || '#00C853',
    borderColor: COLORS.PRIMARY || '#00C853',
  },
  paymentMethodText: {
    color: COLORS.BLACK || '#1A1A1A',
    fontSize: 14,
    fontWeight: '600',
  },
  accountNumberInput: {
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: COLORS.PRIMARY || '#00C853',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    flex: 1,
    marginRight: 10,
  },
  deleteStoreButton: {
    backgroundColor: COLORS.ERROR || '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    flex: 1,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.DISABLED || '#A0A0A0',
    opacity: 0.7,
  },
  submitButtonText: {
    color: COLORS.WHITE || '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default EditarTiendaScreen;
