import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {COLORS, ICONS} from '../../../constants';
import styles from './styles/CrearTiendaScreenStyle';
import {API_BASE_URL} from '../../../config/Service.Config';
import SCREENS from '../../../screens';

// Dynamic icon loading
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};

const CreateProfessionalAccount = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    description: '',
    owner: '',
    category: '',
    categoryName: '',
    subcategory: '',
    subcategoryName: '',
    address: '',
    addressDetails: '',
    capitalOwnership: '',
    capitalOwnershipDisplay: '',
    companySize: '',
    companySizeDisplay: '',
    legalForm: '',
    legalFormDisplay: '',
    economicSector: '',
    economicSectorDisplay: '',
    operationScope: '',
    operationScopeDisplay: '',
    socialCapital: '',
    numberOfEstablishments: '',
    numberOfEmployees: '',
    nif: '',
    expedientNumber: '',
    certificateNumber: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingAccount, setExistingAccount] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');

  // Cargar selecciones previas desde AsyncStorage al montar el componente
  useEffect(() => {
    const loadSelections = async () => {
      try {
        const storedCategory = await AsyncStorage.getItem('selectedCategory');
        const storedSubcategory = await AsyncStorage.getItem(
          'selectedSubcategory',
        );
        const storedAddress = await AsyncStorage.getItem('selectedAddress');
        const storedCapitalOwnership = await AsyncStorage.getItem(
          'selectedCapitalOwnership',
        );
        const storedCompanySize = await AsyncStorage.getItem(
          'selectedCompanySize',
        );
        const storedLegalForm = await AsyncStorage.getItem('selectedLegalForm');
        const storedEconomicSector = await AsyncStorage.getItem(
          'selectedEconomicSector',
        );
        const storedOperationScope = await AsyncStorage.getItem(
          'selectedOperationScope',
        );

        const updates = {};

        if (storedCategory && storedSubcategory) {
          const category = JSON.parse(storedCategory);
          const subcategory = JSON.parse(storedSubcategory);
          updates.category = category._id;
          updates.categoryName = category.name;
          updates.subcategory = subcategory._id;
          updates.subcategoryName = subcategory.name;
        }

        if (storedAddress) {
          const address = JSON.parse(storedAddress);
          updates.address = address._id;
          updates.addressDetails = `${
            address.street ? address.street + ', ' : ''
          }${address.city}${address.state ? ', ' + address.state : ''}${
            address.country ? ', ' + address.country : ''
          }${address.postalCode ? ', ' + address.postalCode : ''}`
            .trim()
            .replace(/,\s*$/, '');
        }

        if (storedCapitalOwnership) {
          const capitalOwnership = JSON.parse(storedCapitalOwnership);
          updates.capitalOwnership = capitalOwnership.value;
          updates.capitalOwnershipDisplay = capitalOwnership.display;
        }

        if (storedCompanySize) {
          const companySize = JSON.parse(storedCompanySize);
          updates.companySize = companySize.value;
          updates.companySizeDisplay = companySize.display;
        }

        if (storedLegalForm) {
          const legalForm = JSON.parse(storedLegalForm);
          updates.legalForm = legalForm.value;
          updates.legalFormDisplay = legalForm.display;
        }

        if (storedEconomicSector) {
          const economicSector = JSON.parse(storedEconomicSector);
          updates.economicSector = economicSector.value;
          updates.economicSectorDisplay = economicSector.display;
        }

        if (storedOperationScope) {
          const operationScope = JSON.parse(storedOperationScope);
          updates.operationScope = operationScope.value;
          updates.operationScopeDisplay = operationScope.display;
        }

        if (Object.keys(updates).length > 0) {
          setFormData(prev => ({...prev, ...updates}));
        }
      } catch (error) {
        console.error('Error al cargar selecciones previas:', error);
      }
    };
    loadSelections();
  }, []);

  // Actualizar formData con los valores desde params
  useEffect(() => {
    const updateFormDataFromParams = async () => {
      console.log('Received params:', params); // Log para depuración
      const updates = {};

      // Categoría y Subcategoría
      if (
        params?.categoryId &&
        params?.categoryName &&
        params?.subcategoryId &&
        params?.subcategoryName &&
        (formData.category !== params.categoryId ||
          formData.subcategory !== params.subcategoryId)
      ) {
        updates.category = params.categoryId;
        updates.categoryName = params.categoryName;
        updates.subcategory = params.subcategoryId;
        updates.subcategoryName = params.subcategoryName;

        try {
          await AsyncStorage.setItem(
            'selectedCategory',
            JSON.stringify({
              _id: params.categoryId,
              name: params.categoryName,
            }),
          );
          await AsyncStorage.setItem(
            'selectedSubcategory',
            JSON.stringify({
              _id: params.subcategoryId,
              name: params.subcategoryName,
            }),
          );
        } catch (error) {
          console.error('Error al guardar selecciones en AsyncStorage:', error);
        }
      }

      // Dirección
      if (
        params?.addressId &&
        params?.addressDetails &&
        formData.address !== params.addressId
      ) {
        updates.address = params.addressId;
        updates.addressDetails = params.addressDetails;

        try {
          const addressData = {
            _id: params.addressId,
            street: params.street || '',
            city: params.city || params.addressDetails,
            state: params.state || '',
            country: params.country || '',
            postalCode: params.postalCode || '',
          };
          console.log('Saving address to AsyncStorage:', addressData); // Log para depuración
          await AsyncStorage.setItem(
            'selectedAddress',
            JSON.stringify(addressData),
          );
        } catch (error) {
          console.error('Error al guardar dirección en AsyncStorage:', error);
        }
      }

      // Otros campos (Propiedad del Capital, Tamaño de la Empresa, etc.)
      if (
        params?.capitalOwnershipValue &&
        params?.capitalOwnershipDisplay &&
        formData.capitalOwnership !== params.capitalOwnershipValue
      ) {
        updates.capitalOwnership = params.capitalOwnershipValue;
        updates.capitalOwnershipDisplay = params.capitalOwnershipDisplay;
        try {
          await AsyncStorage.setItem(
            'selectedCapitalOwnership',
            JSON.stringify({
              value: params.capitalOwnershipValue,
              display: params.capitalOwnershipDisplay,
            }),
          );
        } catch (error) {
          console.error('Error al guardar propiedad del capital:', error);
        }
      }

      if (
        params?.companySizeValue &&
        params?.companySizeDisplay &&
        formData.companySize !== params.companySizeValue
      ) {
        updates.companySize = params.companySizeValue;
        updates.companySizeDisplay = params.companySizeDisplay;
        try {
          await AsyncStorage.setItem(
            'selectedCompanySize',
            JSON.stringify({
              value: params.companySizeValue,
              display: params.companySizeDisplay,
            }),
          );
        } catch (error) {
          console.error('Error al guardar tamaño de la empresa:', error);
        }
      }

      if (
        params?.legalFormValue &&
        params?.legalFormDisplay &&
        formData.legalForm !== params.legalFormValue
      ) {
        updates.legalForm = params.legalFormValue;
        updates.legalFormDisplay = params.legalFormDisplay;
        try {
          await AsyncStorage.setItem(
            'selectedLegalForm',
            JSON.stringify({
              value: params.legalFormValue,
              display: params.legalFormDisplay,
            }),
          );
        } catch (error) {
          console.error('Error al guardar forma jurídica:', error);
        }
      }

      if (
        params?.economicSectorValue &&
        params?.economicSectorDisplay &&
        formData.economicSector !== params.economicSectorValue
      ) {
        updates.economicSector = params.economicSectorValue;
        updates.economicSectorDisplay = params.economicSectorDisplay;
        try {
          await AsyncStorage.setItem(
            'selectedEconomicSector',
            JSON.stringify({
              value: params.economicSectorValue,
              display: params.economicSectorDisplay,
            }),
          );
        } catch (error) {
          console.error('Error al guardar sector económico:', error);
        }
      }

      if (
        params?.operationScopeValue &&
        params?.operationScopeDisplay &&
        formData.operationScope !== params.operationScopeValue
      ) {
        updates.operationScope = params.operationScopeValue;
        updates.operationScopeDisplay = params.operationScopeDisplay;
        try {
          await AsyncStorage.setItem(
            'selectedOperationScope',
            JSON.stringify({
              value: params.operationScopeValue,
              display: params.operationScopeDisplay,
            }),
          );
        } catch (error) {
          console.error('Error al guardar ámbito de actuación:', error);
        }
      }

      if (Object.keys(updates).length > 0) {
        setFormData(prev => ({...prev, ...updates}));
      }
    };

    updateFormDataFromParams();
  }, [params]);

  // Función para verificar la existencia de una cuenta profesional
  const checkAccount = async (userId, forceFetch = false) => {
    try {
      if (!forceFetch) {
        const storedData = await AsyncStorage.getItem('professional_data');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (
            parsedData &&
            parsedData.id &&
            parsedData.name &&
            parsedData.email &&
            parsedData.phone_number &&
            parsedData.description &&
            parsedData.owner === userId
          ) {
            setExistingAccount(parsedData);
            setIsLoading(false);
            return;
          }
        }
      }

      const response = await axios.get(
        `${API_BASE_URL}/professional/owner/${userId}`,
      );
      if (response.data) {
        const accountData = {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          phone_number: response.data.phone_number,
          description: response.data.description,
          owner: userId,
          ownerName: response.data.owner?.userName || userName || '',
          avatar: response.data.avatar?.url,
          category: response.data.category?._id || '',
          categoryName: response.data.category?.name || '',
          subcategory: response.data.subcategory?._id || '',
          subcategoryName: response.data.subcategory?.name || '',
          address: response.data.address?._id || '',
          addressDetails: response.data.address
            ? `${
                response.data.address.street
                  ? response.data.address.street + ', '
                  : ''
              }${response.data.address.city}${
                response.data.address.state
                  ? ', ' + response.data.address.state
                  : ''
              }${
                response.data.address.country
                  ? ', ' + response.data.address.country
                  : ''
              }${
                response.data.address.postalCode
                  ? ', ' + response.data.address.postalCode
                  : ''
              }`
                .trim()
                .replace(/,\s*$/, '')
            : '',
          capitalOwnership: response.data.capitalOwnership || '',
          companySize: response.data.companySize || '',
          legalForm: response.data.legalForm || '',
          economicSector: response.data.economicSector || '',
          operationScope: response.data.operationScope || '',
          socialCapital: response.data.socialCapital || '',
          numberOfEstablishments: response.data.numberOfEstablishments || '',
          numberOfEmployees: response.data.numberOfEmployees || '',
          nif: response.data.nif || '',
          expedientNumber: response.data.expedientNumber || '',
          certificateNumber: response.data.certificateNumber || '',
        };
        setExistingAccount(accountData);
        await AsyncStorage.setItem(
          'professional_data',
          JSON.stringify(accountData),
        );
      } else {
        setExistingAccount(null);
        await AsyncStorage.removeItem('professional_data');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setExistingAccount(null);
        await AsyncStorage.removeItem('professional_data');
      } else if (error.response?.status === 400) {
        Alert.alert('Error', 'El ID del usuario no es válido.');
        await AsyncStorage.removeItem('id');
        await AsyncStorage.multiRemove([
          'professional_data',
          'selectedCategory',
          'selectedSubcategory',
          'selectedAddress',
          'selectedCapitalOwnership',
          'selectedCompanySize',
          'selectedLegalForm',
          'selectedEconomicSector',
          'selectedOperationScope',
        ]);
        navigation.navigate('LoginScreen');
      } else {
        console.error('Error al verificar cuenta profesional:', error);
        Alert.alert(
          'Error',
          'No se pudo verificar si tienes una cuenta profesional. Intenta de nuevo.',
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
          Alert.alert(
            'Error',
            'Debes iniciar sesión para crear una cuenta profesional.',
          );
          navigation.navigate('LoginScreen');
          return;
        }
        const parsedId = JSON.parse(id);
        if (!parsedId || typeof parsedId !== 'string') {
          await AsyncStorage.removeItem('id');
          await AsyncStorage.multiRemove([
            'professional_data',
            'selectedCategory',
            'selectedSubcategory',
            'selectedAddress',
            'selectedCapitalOwnership',
            'selectedCompanySize',
            'selectedLegalForm',
            'selectedEconomicSector',
            'selectedOperationScope',
          ]);
          Alert.alert(
            'Error',
            'Sesión inválida. Por favor, inicia sesión de nuevo.',
          );
          navigation.navigate('LoginScreen');
          return;
        }
        setUserId(parsedId);
        setFormData(prev => ({...prev, owner: parsedId}));

        const userData = await AsyncStorage.getItem(`user${parsedId}`);
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserName(parsedUserData.userName || '');
          setFormData(prev => ({
            ...prev,
            email: parsedUserData.email || '',
          }));
        } else {
          Alert.alert('Error', 'Datos de usuario no encontrados.');
          navigation.navigate('LoginScreen');
          return;
        }

        await checkAccount(parsedId);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos iniciales.');
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Verificar cuenta cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        setIsLoading(true);
        checkAccount(userId, params?.accountDeleted === 'true');
      }
    }, [userId, userName, params?.accountDeleted]),
  );

  // Verificar si la cuenta fue eliminada
  useEffect(() => {
    if (params?.accountDeleted === 'true') {
      setExistingAccount(null);
      AsyncStorage.multiRemove([
        'professional_data',
        'selectedCategory',
        'selectedSubcategory',
        'selectedAddress',
        'selectedCapitalOwnership',
        'selectedCompanySize',
        'selectedLegalForm',
        'selectedEconomicSector',
        'selectedOperationScope',
      ]);
    }
  }, [params?.accountDeleted]);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const pickImage = async () => {
    if (avatar) {
      Alert.alert('Límite alcanzado', 'Solo se permite subir un avatar.');
      return;
    }

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        maxWidth: 500,
        maxHeight: 500,
      });

      if (!result.didCancel && !result.errorCode && result.assets) {
        const uri = result.assets[0].uri;
        setAvatar(uri);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo abrir la galería de imágenes.');
    }
  };

  const removeImage = () => {
    setAvatar(null);
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!formData.name) missingFields.push('Nombre');
    if (!formData.email) missingFields.push('Email');
    if (!formData.phone_number) missingFields.push('Teléfono');
    if (!formData.description) missingFields.push('Descripción');
    if (!formData.owner) missingFields.push('Propietario');
    if (!formData.category) missingFields.push('Categoría');
    if (!formData.subcategory) missingFields.push('Subcategoría');
    if (!formData.address) missingFields.push('Dirección');
    if (!formData.capitalOwnership) missingFields.push('Propiedad del Capital');
    if (!formData.companySize) missingFields.push('Tamaño de la Empresa');
    if (!formData.legalForm) missingFields.push('Forma Jurídica');
    if (!formData.economicSector) missingFields.push('Sector Económico');
    if (!formData.operationScope) missingFields.push('Ámbito de Actuación');
    if (!formData.socialCapital) missingFields.push('Capital Social');
    if (!formData.numberOfEstablishments)
      missingFields.push('Nº de Establecimientos');
    if (!formData.numberOfEmployees) missingFields.push('Nº de Empleados');
    if (!formData.nif) missingFields.push('NIF');
    if (!formData.expedientNumber) missingFields.push('Nº de Expediente');
    if (!formData.certificateNumber) missingFields.push('Nº de Certificado');
    if (!avatar) missingFields.push('Avatar');

    if (missingFields.length > 0) {
      Alert.alert(
        'Campos obligatorios',
        `Los siguientes campos son requeridos: ${missingFields.join(', ')}`,
      );
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting formData:', formData); // Log para depuración
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('owner', userId);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subcategory', formData.subcategory);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('capitalOwnership', formData.capitalOwnership);
      formDataToSend.append('companySize', formData.companySize);
      formDataToSend.append('legalForm', formData.legalForm);
      formDataToSend.append('economicSector', formData.economicSector);
      formDataToSend.append('operationScope', formData.operationScope);
      formDataToSend.append('socialCapital', formData.socialCapital);
      formDataToSend.append(
        'numberOfEstablishments',
        formData.numberOfEstablishments,
      );
      formDataToSend.append('numberOfEmployees', formData.numberOfEmployees);
      formDataToSend.append('nif', formData.nif);
      formDataToSend.append('expedientNumber', formData.expedientNumber);
      formDataToSend.append('certificateNumber', formData.certificateNumber);

      if (avatar) {
        formDataToSend.append('avatar', {
          uri: avatar,
          name: `avatar_${userId}.jpg`,
          type: 'image/jpeg',
        });
      }

      const response = await axios.post(
        `${API_BASE_URL}/professional`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const accountData = {
        id: response.data.professional._id,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        description: formData.description,
        owner: userId,
        ownerName: userName,
        avatar: response.data.professional.avatar?.url,
        category: formData.category,
        categoryName: formData.categoryName,
        subcategory: formData.subcategory,
        subcategoryName: formData.subcategoryName,
        address: formData.address,
        addressDetails: formData.addressDetails,
        capitalOwnership: formData.capitalOwnership,
        companySize: formData.companySize,
        legalForm: formData.legalForm,
        economicSector: formData.economicSector,
        operationScope: formData.operationScope,
        socialCapital: formData.socialCapital,
        numberOfEstablishments: formData.numberOfEstablishments,
        numberOfEmployees: formData.numberOfEmployees,
        nif: formData.nif,
        expedientNumber: formData.expedientNumber,
        certificateNumber: formData.certificateNumber,
      };
      await AsyncStorage.setItem(
        'professional_data',
        JSON.stringify(accountData),
      );
      setExistingAccount(accountData);

      // Limpiar el formulario y AsyncStorage de selecciones
      setFormData({
        name: '',
        email: formData.email,
        phone_number: '',
        description: '',
        owner: userId,
        category: '',
        categoryName: '',
        subcategory: '',
        subcategoryName: '',
        address: '',
        addressDetails: '',
        capitalOwnership: '',
        capitalOwnershipDisplay: '',
        companySize: '',
        companySizeDisplay: '',
        legalForm: '',
        legalFormDisplay: '',
        economicSector: '',
        economicSectorDisplay: '',
        operationScope: '',
        operationScopeDisplay: '',
        socialCapital: '',
        numberOfEstablishments: '',
        numberOfEmployees: '',
        nif: '',
        expedientNumber: '',
        certificateNumber: '',
      });
      setAvatar(null);
      await AsyncStorage.multiRemove([
        'selectedCategory',
        'selectedSubcategory',
        'selectedAddress',
        'selectedCapitalOwnership',
        'selectedCompanySize',
        'selectedLegalForm',
        'selectedEconomicSector',
        'selectedOperationScope',
      ]);

      Alert.alert('Éxito', 'Cuenta profesional creada correctamente');
      navigation.navigate(SCREENS.CUENTA_OFICIAL);
    } catch (error) {
      console.error(
        'Error al crear cuenta profesional:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'No se pudo crear la cuenta profesional. Intenta de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Componente para mostrar los detalles de la cuenta profesional
  const AccountCard = ({account}) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate(SCREENS.EDIT_PROFESIONAL_ACCOUNT, {
          account: JSON.stringify(account),
        })
      }>
      <Text style={styles.cardTitle}>{account.name}</Text>
      {account.avatar && (
        <Image source={{uri: account.avatar}} style={styles.imagePreview} />
      )}
      <Text style={styles.cardLabel}>Propietario:</Text>
      <Text style={styles.cardText}>{account.ownerName}</Text>
      <Text style={styles.cardLabel}>Email:</Text>
      <Text style={styles.cardText}>{account.email}</Text>
      <Text style={styles.cardLabel}>Teléfono:</Text>
      <Text style={styles.cardText}>{account.phone_number}</Text>
      <Text style={styles.cardLabel}>Categoría:</Text>
      <Text style={styles.cardText}>{account.categoryName}</Text>
      <Text style={styles.cardLabel}>Subcategoría:</Text>
      <Text style={styles.cardText}>{account.subcategoryName}</Text>
      <Text style={styles.cardLabel}>Dirección:</Text>
      <Text style={styles.cardText}>
        {account.addressDetails || 'Sin dirección especificada'}
      </Text>
      <Text style={styles.cardLabel}>Propiedad del Capital:</Text>
      <Text style={styles.cardText}>{account.capitalOwnership}</Text>
      <Text style={styles.cardLabel}>Tamaño de la Empresa:</Text>
      <Text style={styles.cardText}>{account.companySize}</Text>
      <Text style={styles.cardLabel}>Forma Jurídica:</Text>
      <Text style={styles.cardText}>{account.legalForm}</Text>
      <Text style={styles.cardLabel}>Sector Económico:</Text>
      <Text style={styles.cardText}>{account.economicSector}</Text>
      <Text style={styles.cardLabel}>Ámbito de Actuación:</Text>
      <Text style={styles.cardText}>{account.operationScope}</Text>
      <Text style={styles.cardLabel}>Capital Social:</Text>
      <Text style={styles.cardText}>{account.socialCapital}</Text>
      <Text style={styles.cardLabel}>Nº de Establecimientos:</Text>
      <Text style={styles.cardText}>{account.numberOfEstablishments}</Text>
      <Text style={styles.cardLabel}>Nº de Empleados:</Text>
      <Text style={styles.cardText}>{account.numberOfEmployees}</Text>
      <Text style={styles.cardLabel}>NIF:</Text>
      <Text style={styles.cardText}>{account.nif}</Text>
      <Text style={styles.cardLabel}>Nº de Expediente:</Text>
      <Text style={styles.cardText}>{account.expedientNumber}</Text>
      <Text style={styles.cardLabel}>Nº de Certificado:</Text>
      <Text style={styles.cardText}>{account.certificateNumber}</Text>
      <Text style={styles.cardLabel}>Descripción:</Text>
      <Text style={styles.cardText}>{account.description}</Text>
    </TouchableOpacity>
  );

  // Mostrar loader centrado mientras se verifica
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.green} />
        </View>
      </SafeAreaView>
    );
  }

  // Renderizar AccountCard si existe una cuenta profesional
  if (existingAccount) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {ICONS.CHEVRON_LEFT &&
              (() => {
                const ChevronLeftIcon =
                  IconComponents[ICONS.CHEVRON_LEFT.library];
                return (
                  <ChevronLeftIcon
                    name={ICONS.CHEVRON_LEFT.name}
                    size={ICONS.CHEVRON_LEFT.size || 30}
                    color={COLORS.green}
                  />
                );
              })()}
          </TouchableOpacity>
          <Text style={styles.headerText}>
            Detalles de la Cuenta Profesional
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <AccountCard account={existingAccount} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Renderizar formulario si no hay cuenta profesional
  return (
    <>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {ICONS.CHEVRON_LEFT &&
              (() => {
                const ChevronLeftIcon =
                  IconComponents[ICONS.CHEVRON_LEFT.library];
                return (
                  <ChevronLeftIcon
                    name={ICONS.CHEVRON_LEFT.name}
                    size={ICONS.CHEVRON_LEFT.size || 30}
                    color={COLORS.green}
                  />
                );
              })()}
          </TouchableOpacity>
          <Text style={styles.headerText}>Crear Cuenta Profesional</Text>
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
            <Text style={styles.label}>Categoría y Subcategoría*</Text>
            <TouchableOpacity
              style={[
                styles.selectionPicker,
                formData.categoryName &&
                  formData.subcategoryName &&
                  styles.selectionPickerSelected,
              ]}
              onPress={() =>
                navigation.navigate(SCREENS.CATEGORY_SELECTION_SCREEN, {
                  returnScreen: 'CreateProfessionalAccount',
                })
              }>
              <Text
                style={[
                  styles.selectionPickerText,
                  formData.categoryName &&
                    formData.subcategoryName &&
                    styles.selectionPickerTextSelected,
                ]}>
                {formData.categoryName && formData.subcategoryName
                  ? `${formData.categoryName} - ${formData.subcategoryName}`
                  : 'Seleccionar Categoría y Subcategoría'}
              </Text>
              {ICONS.CHEVRON_RIGHT &&
                (() => {
                  const ChevronRightIcon =
                    IconComponents[ICONS.CHEVRON_RIGHT.library];
                  return (
                    <ChevronRightIcon
                      name={ICONS.CHEVRON_RIGHT.name}
                      size={ICONS.CHEVRON_RIGHT.size || 24}
                      color={COLORS.placeholder}
                    />
                  );
                })()}
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección*</Text>
            <TouchableOpacity
              style={[
                styles.selectionPicker,
                formData.address && styles.selectionPickerSelected,
              ]}
              onPress={() =>
                navigation.navigate(SCREENS.SELECT_CITY_SCREEN, {
                  returnScreen: 'CreateProfessionalAccount',
                })
              }>
              <Text
                style={[
                  styles.selectionPickerText,
                  formData.address && styles.selectionPickerTextSelected,
                ]}>
                {formData.addressDetails || 'Seleccionar Dirección'}
              </Text>
              {ICONS.CHEVRON_RIGHT &&
                (() => {
                  const ChevronRightIcon =
                    IconComponents[ICONS.CHEVRON_RIGHT.library];
                  return (
                    <ChevronRightIcon
                      name={ICONS.CHEVRON_RIGHT.name}
                      size={ICONS.CHEVRON_RIGHT.size || 24}
                      color={COLORS.placeholder}
                    />
                  );
                })()}
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Propiedad del Capital*</Text>
            <TouchableOpacity
              style={[
                styles.selectionPicker,
                formData.capitalOwnership && styles.selectionPickerSelected,
              ]}
              onPress={() =>
                navigation.navigate(SCREENS.CAPITAL_OWNER_SCREEN, {
                  returnScreen: 'CreateProfessionalAccount',
                })
              }>
              <Text
                style={[
                  styles.selectionPickerText,
                  formData.capitalOwnership &&
                    styles.selectionPickerTextSelected,
                ]}>
                {formData.capitalOwnershipDisplay ||
                  'Seleccionar Propiedad del Capital'}
              </Text>
              {ICONS.CHEVRON_RIGHT &&
                (() => {
                  const ChevronRightIcon =
                    IconComponents[ICONS.CHEVRON_RIGHT.library];
                  return (
                    <ChevronRightIcon
                      name={ICONS.CHEVRON_RIGHT.name}
                      size={ICONS.CHEVRON_RIGHT.size || 24}
                      color={COLORS.placeholder}
                    />
                  );
                })()}
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tamaño de la Empresa*</Text>
            <TouchableOpacity
              style={[
                styles.selectionPicker,
                formData.companySize && styles.selectionPickerSelected,
              ]}
              onPress={() =>
                navigation.navigate(SCREENS.COMPANY_SIZE_SCREEN, {
                  returnScreen: 'CreateProfessionalAccount',
                })
              }>
              <Text
                style={[
                  styles.selectionPickerText,
                  formData.companySize && styles.selectionPickerTextSelected,
                ]}>
                {formData.companySizeDisplay ||
                  'Seleccionar Tamaño de la Empresa'}
              </Text>
              {ICONS.CHEVRON_RIGHT &&
                (() => {
                  const ChevronRightIcon =
                    IconComponents[ICONS.CHEVRON_RIGHT.library];
                  return (
                    <ChevronRightIcon
                      name={ICONS.CHEVRON_RIGHT.name}
                      size={ICONS.CHEVRON_RIGHT.size || 24}
                      color={COLORS.placeholder}
                    />
                  );
                })()}
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Forma Jurídica*</Text>
            <TouchableOpacity
              style={[
                styles.selectionPicker,
                formData.legalForm && styles.selectionPickerSelected,
              ]}
              onPress={() =>
                navigation.navigate(SCREENS.LEGAL_FORM_SCREEN, {
                  returnScreen: 'CreateProfessionalAccount',
                })
              }>
              <Text
                style={[
                  styles.selectionPickerText,
                  formData.legalForm && styles.selectionPickerTextSelected,
                ]}>
                {formData.legalFormDisplay || 'Seleccionar Forma Jurídica'}
              </Text>
              {ICONS.CHEVRON_RIGHT &&
                (() => {
                  const ChevronRightIcon =
                    IconComponents[ICONS.CHEVRON_RIGHT.library];
                  return (
                    <ChevronRightIcon
                      name={ICONS.CHEVRON_RIGHT.name}
                      size={ICONS.CHEVRON_RIGHT.size || 24}
                      color={COLORS.placeholder}
                    />
                  );
                })()}
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sector Económico*</Text>
            <TouchableOpacity
              style={[
                styles.selectionPicker,
                formData.economicSector && styles.selectionPickerSelected,
              ]}
              onPress={() =>
                navigation.navigate(SCREENS.ECONOMIC_SECTOR_SCREEN, {
                  returnScreen: 'CreateProfessionalAccount',
                })
              }>
              <Text
                style={[
                  styles.selectionPickerText,
                  formData.economicSector && styles.selectionPickerTextSelected,
                ]}>
                {formData.economicSectorDisplay ||
                  'Seleccionar Sector Económico'}
              </Text>
              {ICONS.CHEVRON_RIGHT &&
                (() => {
                  const ChevronRightIcon =
                    IconComponents[ICONS.CHEVRON_RIGHT.library];
                  return (
                    <ChevronRightIcon
                      name={ICONS.CHEVRON_RIGHT.name}
                      size={ICONS.CHEVRON_RIGHT.size || 24}
                      color={COLORS.placeholder}
                    />
                  );
                })()}
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ámbito de Actuación*</Text>
            <TouchableOpacity
              style={[
                styles.selectionPicker,
                formData.operationScope && styles.selectionPickerSelected,
              ]}
              onPress={() =>
                navigation.navigate(SCREENS.OPERATION_SCOPEREEN, {
                  returnScreen: 'CreateProfessionalAccount',
                })
              }>
              <Text
                style={[
                  styles.selectionPickerText,
                  formData.operationScope && styles.selectionPickerTextSelected,
                ]}>
                {formData.operationScopeDisplay ||
                  'Seleccionar Ámbito de Actuación'}
              </Text>
              {ICONS.CHEVRON_RIGHT &&
                (() => {
                  const ChevronRightIcon =
                    IconComponents[ICONS.CHEVRON_RIGHT.library];
                  return (
                    <ChevronRightIcon
                      name={ICONS.CHEVRON_RIGHT.name}
                      size={ICONS.CHEVRON_RIGHT.size || 24}
                      color={COLORS.placeholder}
                    />
                  );
                })()}
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre profesional*</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
              placeholder="Ej: Juan Pérez Profesional"
              placeholderTextColor={COLORS.placeholder}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email*</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
              placeholder="Ej: profesional@ejemplo.com"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
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
            <Text style={styles.label}>Capital Social*</Text>
            <TextInput
              style={styles.input}
              value={formData.socialCapital}
              onChangeText={text => handleChange('socialCapital', text)}
              placeholder="Ej: 1,000,000 FCFA"
              placeholderTextColor={COLORS.placeholder}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nº de Establecimientos*</Text>
            <TextInput
              style={styles.input}
              value={formData.numberOfEstablishments}
              onChangeText={text =>
                handleChange('numberOfEstablishments', text)
              }
              placeholder="Ej: 1"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nº de Empleados*</Text>
            <TextInput
              style={styles.input}
              value={formData.numberOfEmployees}
              onChangeText={text => handleChange('numberOfEmployees', text)}
              placeholder="Ej: 12"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>NIF*</Text>
            <TextInput
              style={styles.input}
              value={formData.nif}
              onChangeText={text => handleChange('nif', text)}
              placeholder="Ej: 038446EG-24"
              placeholderTextColor={COLORS.placeholder}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nº de Expediente*</Text>
            <TextInput
              style={styles.input}
              value={formData.expedientNumber}
              onChangeText={text => handleChange('expedientNumber', text)}
              placeholder="Ej: 05069/2024"
              placeholderTextColor={COLORS.placeholder}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nº de Certificado*</Text>
            <TextInput
              style={styles.input}
              value={formData.certificateNumber}
              onChangeText={text => handleChange('certificateNumber', text)}
              placeholder="Ej: 3025"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción*</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={formData.description}
              onChangeText={text => handleChange('description', text)}
              placeholder="Describe tus servicios profesionales"
              placeholderTextColor={COLORS.placeholder}
              multiline
              numberOfLines={4}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Avatar*</Text>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={() => pickImage()}>
              {avatar ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri: avatar}}
                    style={styles.imagePreview}
                    key={avatar}
                    onError={e => {
                      console.error(
                        'Error cargando avatar:',
                        e.nativeEvent.error,
                      );
                      Alert.alert('Error', 'No se pudo cargar el avatar.');
                    }}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeImage()}>
                    {ICONS.DELETE &&
                      (() => {
                        const DeleteIcon = IconComponents[ICONS.DELETE.library];
                        return (
                          <DeleteIcon
                            name={ICONS.DELETE.name}
                            size={ICONS.DELETE.size || 24}
                            color={COLORS.red}
                          />
                        );
                      })()}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.imagePlaceholder}>
                  {ICONS.IMAGE &&
                    (() => {
                      const ImageIcon = IconComponents[ICONS.IMAGE.library];
                      return (
                        <ImageIcon
                          name={ICONS.IMAGE.name}
                          size={ICONS.IMAGE.size || 40}
                          color={COLORS.placeholder}
                        />
                      );
                    })()}
                  <Text style={styles.imagePickerText}>
                    Seleccionar Avatar (1:1)
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}>
            {ICONS.WORK &&
              (() => {
                const WorkIcon = IconComponents[ICONS.WORK.library];
                return (
                  <WorkIcon
                    name={ICONS.WORK.name}
                    size={ICONS.WORK.size || 24}
                    color={COLORS.white}
                  />
                );
              })()}
            <Text style={styles.submitButtonText}>
              {loading ? 'Creando...' : 'Crear Cuenta Profesional'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default CreateProfessionalAccount;
