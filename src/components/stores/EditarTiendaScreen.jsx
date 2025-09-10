import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '../../config/Service.Config';
import {COLORS, ICONS} from '../../constants';
import SCREENS from '../../screens';
import styles from './styles/EditarTiendaScreen';

const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  Feather: require('react-native-vector-icons/Feather').default,
  Ionicons: require('react-native-vector-icons/Ionicons').default,
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

const InputField = ({label, value, placeholder, onPress, editable, error}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <Pressable onPress={onPress} disabled={!onPress}>
      <TextInput
        style={[
          styles.input,
          !editable && styles.disabledInput,
          error && styles.inputError,
        ]}
        value={value}
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor={COLORS.PLACEHOLDER || '#9CA3AF'}
      />
    </Pressable>
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
    address: storeData.address?.name || '',
    cityId: storeData.address?.id || '',
    specific_location: storeData.specific_location || '',
    owner: storeData.owner || '',
    documentType: storeData.document?.[0]?.type || '',
  });
  const [logo, setLogo] = useState(storeData.logo?.url || null);
  const [banner, setBanner] = useState(storeData.banner?.url || null);
  const [documents, setDocuments] = useState(
    storeData.document?.map(doc => ({type: doc.type, url: doc.url})) || [],
  );
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
  const [errors, setErrors] = useState({});

  const BackIcon = IconComponents[ICONS.BACK?.library || 'MaterialIcons'];
  const ImageIcon = IconComponents[ICONS.IMAGE?.library || 'MaterialIcons'];
  const PanoramaIcon =
    IconComponents[ICONS.PANORAMA?.library || 'MaterialIcons'];
  const DeleteIcon = IconComponents[ICONS.DELETE?.library || 'MaterialIcons'];
  const UpdateIcon = IconComponents[ICONS.UPDATE?.library || 'MaterialIcons'];
  const DeleteForeverIcon =
    IconComponents[ICONS.DELETE_FOREVER?.library || 'MaterialIcons'];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const id = await AsyncStorage.getItem('id');
        if (!id) {
          Alert.alert('Error', 'Debes iniciar sesión para editar una tienda.');
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
        if (parsedUserData?.ciudad?.id && !formData.cityId) {
          const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(
            parsedUserData.ciudad.id,
          );
          if (!isValidObjectId) {
            Alert.alert(
              'Error',
              'El ID de la ciudad del usuario no es válido.',
            );
            navigation.navigate(SCREENS.PROFILE);
            return;
          }
          setFormData(prev => ({
            ...prev,
            address: parsedUserData.ciudad.name,
            cityId: parsedUserData.ciudad.id,
          }));
        }
      } catch (error) {
        console.error('Error al cargar datos de usuario:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos del usuario.');
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, [navigation]);

  const handleCitySelect = selectedCity => {
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
    setErrors(prev => ({...prev, address: false}));
  };

  const handleChange = (name, value) => {
    setFormData({...formData, [name]: value});
    setErrors(prev => ({...prev, [name]: false}));
  };

  const handleDocumentTypeSelect = typeKey => {
    setFormData({...formData, documentType: typeKey});
    setErrors(prev => ({...prev, documentType: false}));
    // Update existing documents with new type
    setDocuments(prev => prev.map(doc => ({...doc, type: typeKey})));
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
      setErrors(prev => ({...prev, [methodKey]: false}));
    }
  };

  const handleAccountNumberChange = (methodKey, value) => {
    setAccountNumbers(prev => ({
      ...prev,
      [methodKey]: value,
    }));
    setErrors(prev => ({...prev, [methodKey]: false}));
  };

  const pickImage = async type => {
    const imageStates = {
      logo: {current: logo, setter: setLogo, max: 1},
      banner: {current: banner, setter: setBanner, max: 1},
      document: {current: documents, setter: setDocuments, max: 2},
    };

    const {current, setter, max} = imageStates[type];
    if (current && (type === 'document' ? current.length >= max : current)) {
      Alert.alert(
        'Límite alcanzado',
        `Solo se permiten hasta ${max} ${type}(s).`,
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      maxWidth: type === 'logo' ? 512 : type === 'banner' ? 1024 : 800,
      maxHeight: type === 'logo' ? 512 : type === 'banner' ? 256 : 600,
      quality: 0.7,
      includeBase64: false,
      selectionLimit: type === 'document' ? max - current.length : 1,
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
        console.log(`Imágenes seleccionadas para ${type}: ${uris}`);
        if (type === 'document') {
          const newDocs = uris.map(uri => ({
            type: formData.documentType || 'DIP',
            url: uri,
          }));
          setter([...current, ...newDocs].slice(0, max));
          setErrors(prev => ({...prev, document: false}));
        } else {
          setter(uris[0]);
          setErrors(prev => ({...prev, [type]: false}));
        }
      }
    });
  };

  const removeImage = (type, index = null) => {
    if (type === 'logo') {
      setLogo(null);
      setErrors(prev => ({...prev, logo: true}));
    } else if (type === 'banner') {
      setBanner(null);
      setErrors(prev => ({...prev, banner: true}));
    } else if (type === 'document' && index !== null) {
      setDocuments(prev => prev.filter((_, i) => i !== index));
      setErrors(prev => ({...prev, document: prev.length <= 1}));
    }
  };

  const handleUpdate = async () => {
    const missingFields = [];
    const newErrors = {};
    if (!formData.name) {
      missingFields.push('Nombre');
      newErrors.name = true;
    }
    if (!formData.description) {
      missingFields.push('Descripción');
      newErrors.description = true;
    }
    if (!formData.phone_number) {
      missingFields.push('Teléfono');
      newErrors.phone_number = true;
    }
    if (!formData.cityId) {
      missingFields.push('Dirección');
      newErrors.address = true;
    }
    if (!formData.specific_location) {
      missingFields.push('Ubicación específica');
      newErrors.specific_location = true;
    }
    if (!formData.owner) {
      missingFields.push('Propietario');
      newErrors.owner = true;
    }
    if (!logo) {
      missingFields.push('Logo');
      newErrors.logo = true;
    }
    if (!banner) {
      missingFields.push('Banner');
      newErrors.banner = true;
    }
    if (documents.length === 0) {
      missingFields.push('Documento');
      newErrors.document = true;
    }
    if (!formData.documentType) {
      missingFields.push('Tipo de documento');
      newErrors.documentType = true;
    }
    paymentMethods.forEach(method => {
      if (!accountNumbers[method]) {
        missingFields.push(`Número de cuenta para ${method}`);
        newErrors[method] = true;
      }
    });

    if (missingFields.length > 0) {
      setErrors(newErrors);
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
      setErrors(prev => ({...prev, address: true}));
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
      formDataToSend.append('documentType', formData.documentType);
      formDataToSend.append(
        'paymentMethods',
        JSON.stringify(
          paymentMethods.map(method => ({
            name: method,
            accountNumber: accountNumbers[method],
          })),
        ),
      );

      if (logo && logo !== storeData.logo?.url) {
        // Validate logo URI
        if (!logo.startsWith('file://') && !logo.startsWith('content://')) {
          console.warn('Invalid logo URI:', logo);
          Alert.alert('Error', 'El logo seleccionado no es válido.');
          setLoading(false);
          return;
        }
        formDataToSend.append('logo', {
          uri: logo,
          name: `logo_${userId}.jpg`,
          type: 'image/jpeg',
        });
      }
      if (banner && banner !== storeData.banner?.url) {
        if (!banner.startsWith('file://') && !banner.startsWith('content://')) {
          console.warn('Invalid banner URI:', banner);
          Alert.alert('Error', 'El banner seleccionado no es válido.');
          setLoading(false);
          return;
        }
        formDataToSend.append('banner', {
          uri: banner,
          name: `banner_${userId}.jpg`,
          type: 'image/jpeg',
        });
      }
      documents.forEach((doc, index) => {
        if (!storeData.document?.some(existing => existing.url === doc.url)) {
          if (
            !doc.url.startsWith('file://') &&
            !doc.url.startsWith('content://')
          ) {
            console.warn(`Invalid document URI at index ${index}:`, doc.url);
            Alert.alert('Error', `El documento ${index + 1} no es válido.`);
            setLoading(false);
            return;
          }
          formDataToSend.append('document', {
            uri: doc.url,
            name: `document_${userId}_${index}.jpg`,
            type: 'image/jpeg',
          });
        }
      });

      console.log('Enviando FormData para actualizar:', {formDataToSend});

      const response = await axios.put(
        `${API_BASE_URL}/tienda/${formData.id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        },
      );

      // Log response to verify document data
      console.log('Backend response:', JSON.stringify(response.data, null, 2));

      setDocuments(response.data.tienda.document || []);

      const updatedStore = {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        phone_number: formData.phone_number,
        address: {id: formData.cityId, name: formData.address},
        specific_location: formData.specific_location,
        owner: userId,
        ownerName: userName,
        logo: {url: response.data.tienda.logo.url},
        banner: {url: response.data.tienda.banner.url},
        document: response.data.tienda.document || [],
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
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar esta tienda? Esta acción no se puede deshacer.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${API_BASE_URL}/tienda/${formData.id}`, {
                timeout: 60000,
              });
              await AsyncStorage.removeItem('store_data');
              Alert.alert('Éxito', 'Tienda eliminada correctamente');
              navigation.navigate(SCREENS.CREAR_TIENDA, {storeDeleted: 'true'});
            } catch (error) {
              console.error(
                'Error al eliminar tienda:',
                error.response?.data || error.message,
              );
              Alert.alert(
                'Error',
                'No se pudo eliminar la tienda. Intenta de nuevo.',
              );
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
        <Pressable
          onPress={() => navigation.goBack()}
          style={({pressed}) => [pressed && {opacity: 0.8}]}
          accessibilityLabel="Volver"
          accessibilityHint="Regresa a la pantalla anterior">
          <BackIcon
            name={ICONS.BACK?.name || 'chevron-left'}
            size={ICONS.BACK?.size || 30}
            color={COLORS.primary || '#00C853'}
          />
        </Pressable>
        <Text style={styles.headerText}>Editar Tienda</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Propietario*</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={userName}
              editable={false}
              placeholder="Nombre del propietario"
              placeholderTextColor={COLORS.PLACEHOLDER || '#9CA3AF'}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de la tienda*</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
              placeholder="Ej: GD Tienda"
              placeholderTextColor={COLORS.PLACEHOLDER || '#9CA3AF'}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción*</Text>
            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                errors.description && styles.inputError,
              ]}
              value={formData.description}
              onChangeText={text => handleChange('description', text)}
              placeholder="Describe tu tienda"
              placeholderTextColor={COLORS.PLACEHOLDER || '#9CA3AF'}
              multiline
              numberOfLines={4}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono de contacto*</Text>
            <TextInput
              style={[styles.input, errors.phone_number && styles.inputError]}
              value={formData.phone_number}
              onChangeText={text => handleChange('phone_number', text)}
              placeholder="Ej: +24022255555"
              placeholderTextColor={COLORS.PLACEHOLDER || '#9CA3AF'}
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
            error={errors.address}
          />
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Ubicación específica (barrio, calle, zona)*
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.specific_location && styles.inputError,
              ]}
              value={formData.specific_location}
              onChangeText={text => handleChange('specific_location', text)}
              placeholder="Ej: Barrio Central, Calle Principal"
              placeholderTextColor={COLORS.PLACEHOLDER || '#9CA3AF'}
            />
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Documentos</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de documento*</Text>
            <View style={styles.documentTypesContainer}>
              {DOCUMENT_TYPES.map(type => (
                <Pressable
                  key={type.key}
                  style={({pressed}) => [
                    styles.documentTypeButton,
                    formData.documentType === type.key &&
                      styles.documentTypeButtonSelected,
                    pressed && {opacity: 0.8},
                    errors.documentType && styles.inputError,
                  ]}
                  onPress={() => handleDocumentTypeSelect(type.key)}
                  disabled={loading}>
                  <Text style={styles.documentTypeText}>{type.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Documentos (DIP, Pasaporte o Permiso de Residencia, hasta 2
              imágenes)*
            </Text>
            <Pressable
              style={({pressed}) => [
                styles.imagePicker,
                pressed && {opacity: 0.8},
                loading || documents.length >= 2
                  ? styles.submitButtonDisabled
                  : {},
                errors.document && styles.inputError,
              ]}
              onPress={() => pickImage('document')}
              disabled={loading || documents.length >= 2}>
              {documents.length > 0 ? (
                <View style={styles.imageContainer}>
                  {documents.map((doc, index) => (
                    <View key={index} style={styles.documentItem}>
                      <Image
                        source={{uri: doc.url}}
                        style={styles.documentPreview}
                        onError={e => {
                          console.error(
                            'Error cargando documento:',
                            e.nativeEvent.error,
                          );
                          Alert.alert(
                            'Error',
                            'No se pudo cargar el documento.',
                          );
                        }}
                      />
                      <Pressable
                        style={({pressed}) => [
                          styles.deleteButton,
                          pressed && {opacity: 0.8},
                        ]}
                        onPress={() => removeImage('document', index)}
                        disabled={loading}>
                        <DeleteIcon
                          name={ICONS.DELETE?.name || 'delete'}
                          size={ICONS.DELETE?.size || 24}
                          color={COLORS.ERROR || '#EF4444'}
                        />
                      </Pressable>
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
                  <ImageIcon
                    name={ICONS.IMAGE?.name || 'image'}
                    size={ICONS.IMAGE?.size || 40}
                    color={COLORS.SECONDARY || '#4B5563'}
                  />
                  <Text style={styles.imagePickerText}>
                    Seleccionar Documento
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Métodos de Pago</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Métodos de pago*</Text>
            <View style={styles.paymentMethodsContainer}>
              {PAYMENT_METHODS.map(method => (
                <View key={method.key} style={styles.paymentMethodItem}>
                  <Pressable
                    style={({pressed}) => [
                      styles.paymentMethodButton,
                      paymentMethods.includes(method.key) &&
                        styles.paymentMethodButtonSelected,
                      pressed && {opacity: 0.8},
                      errors[method.key] && styles.inputError,
                    ]}
                    onPress={() => togglePaymentMethod(method.key)}
                    disabled={loading}>
                    <Text style={styles.paymentMethodText}>{method.name}</Text>
                  </Pressable>
                  {paymentMethods.includes(method.key) && (
                    <TextInput
                      style={[
                        styles.input,
                        styles.accountNumberInput,
                        errors[method.key] && styles.inputError,
                      ]}
                      value={accountNumbers[method.key] || ''}
                      onChangeText={text =>
                        handleAccountNumberChange(method.key, text)
                      }
                      placeholder={`Número de cuenta para ${method.name}`}
                      placeholderTextColor={COLORS.PLACEHOLDER || '#9CA3AF'}
                      keyboardType="numeric"
                      editable={!loading}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Imágenes de la Tienda</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Logo de la tienda*</Text>
            <Pressable
              style={({pressed}) => [
                styles.imagePicker,
                pressed && {opacity: 0.8},
                loading && styles.submitButtonDisabled,
                errors.logo && styles.inputError,
              ]}
              onPress={() => pickImage('logo')}
              disabled={loading}>
              {logo ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri: logo}}
                    style={styles.imagePreview}
                    onError={e => {
                      console.error(
                        'Error cargando logo:',
                        e.nativeEvent.error,
                      );
                      Alert.alert('Error', 'No se pudo cargar el logo.');
                    }}
                  />
                  <Pressable
                    style={({pressed}) => [
                      styles.deleteButton,
                      pressed && {opacity: 0.8},
                    ]}
                    onPress={() => removeImage('logo')}
                    disabled={loading}>
                    <DeleteIcon
                      name={ICONS.DELETE?.name || 'delete'}
                      size={ICONS.DELETE?.size || 24}
                      color={COLORS.ERROR || '#EF4444'}
                    />
                  </Pressable>
                </View>
              ) : (
                <View style={styles.imagePlaceholder}>
                  <ImageIcon
                    name={ICONS.IMAGE?.name || 'image'}
                    size={ICONS.IMAGE?.size || 40}
                    color={COLORS.SECONDARY || '#4B5563'}
                  />
                  <Text style={styles.imagePickerText}>
                    Seleccionar Logo (1:1)
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Banner de la tienda*</Text>
            <Pressable
              style={({pressed}) => [
                styles.imagePicker,
                pressed && {opacity: 0.8},
                loading && styles.submitButtonDisabled,
                errors.banner && styles.inputError,
              ]}
              onPress={() => pickImage('banner')}
              disabled={loading}>
              {banner ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri: banner}}
                    style={styles.bannerPreview}
                    onError={e => {
                      console.error(
                        'Error cargando banner:',
                        e.nativeEvent.error,
                      );
                      Alert.alert('Error', 'No se pudo cargar el banner.');
                    }}
                  />
                  <Pressable
                    style={({pressed}) => [
                      styles.deleteButton,
                      pressed && {opacity: 0.8},
                    ]}
                    onPress={() => removeImage('banner')}
                    disabled={loading}>
                    <DeleteIcon
                      name={ICONS.DELETE?.name || 'delete'}
                      size={ICONS.DELETE?.size || 24}
                      color={COLORS.ERROR || '#EF4444'}
                    />
                  </Pressable>
                </View>
              ) : (
                <View style={styles.imagePlaceholder}>
                  <PanoramaIcon
                    name={ICONS.PANORAMA?.name || 'panorama'}
                    size={ICONS.PANORAMA?.size || 40}
                    color={COLORS.SECONDARY || '#4B5563'}
                  />
                  <Text style={styles.imagePickerText}>
                    Seleccionar Banner (4:1)
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
        <Pressable
          style={({pressed}) => [
            styles.submitButton,
            loading && styles.submitButtonDisabled,
            pressed && {opacity: 0.8, transform: [{scale: 0.98}]},
          ]}
          onPress={handleUpdate}
          disabled={loading}
          accessibilityLabel="Actualizar Tienda"
          accessibilityHint="Toca para guardar los cambios de la tienda">
          <UpdateIcon
            name={ICONS.UPDATE?.name || 'update'}
            size={ICONS.UPDATE?.size || 24}
            color={COLORS.WHITE || '#FFFFFF'}
          />
          <Text style={styles.submitButtonText}>
            {loading ? 'Actualizando...' : 'Actualizar Tienda'}
          </Text>
        </Pressable>
        <Pressable
          style={({pressed}) => [
            styles.deleteButtonFull,
            loading && styles.submitButtonDisabled,
            pressed && {opacity: 0.8, transform: [{scale: 0.98}]},
          ]}
          onPress={handleDelete}
          disabled={loading}
          accessibilityLabel="Eliminar Tienda"
          accessibilityHint="Toca para eliminar la tienda permanentemente">
          <DeleteForeverIcon
            name={ICONS.DELETE_FOREVER?.name || 'delete-forever'}
            size={ICONS.DELETE_FOREVER?.size || 24}
            color={COLORS.WHITE || '#FFFFFF'}
          />
          <Text style={styles.submitButtonText}>Eliminar Tienda</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditarTiendaScreen;
