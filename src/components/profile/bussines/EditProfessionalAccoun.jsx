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
import styles from './styles/EditTiendaSyle';
import {API_BASE_URL} from '../../../config/Service.Config';
import SCREENS from '../../../screens';

// Dynamic icon loading
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};

const EditProfessionalAccount = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {account} = route.params || {};
  const [formData, setFormData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');

  // Initialize form data from passed account
  useEffect(() => {
    const initializeFormData = async () => {
      try {
        setIsLoading(true);
        const id = await AsyncStorage.getItem('id');
        if (!id) {
          Alert.alert('Error', 'Debes iniciar sesión para editar la cuenta.');
          navigation.navigate('LoginScreen');
          return;
        }
        const parsedId = JSON.parse(id);
        setUserId(parsedId);

        const userData = await AsyncStorage.getItem(`user${parsedId}`);
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserName(parsedUserData.userName || '');
        } else {
          Alert.alert('Error', 'Datos de usuario no encontrados.');
          navigation.navigate('LoginScreen');
          return;
        }

        if (account) {
          const parsedAccount = JSON.parse(account);
          setFormData({
            id: parsedAccount.id,
            name: parsedAccount.name || '',
            email: parsedAccount.email || '',
            phone_number: parsedAccount.phone_number || '',
            description: parsedAccount.description || '',
            owner: parsedAccount.owner || parsedId,
            category: parsedAccount.category || '',
            categoryName: parsedAccount.categoryName || '',
            subcategory: parsedAccount.subcategory || '',
            subcategoryName: parsedAccount.subcategoryName || '',
            address: parsedAccount.address || '',
            addressDetails: parsedAccount.addressDetails || '',
            capitalOwnership: parsedAccount.capitalOwnership || '',
            capitalOwnershipDisplay: parsedAccount.capitalOwnership || '',
            companySize: parsedAccount.companySize || '',
            companySizeDisplay: parsedAccount.companySize || '',
            legalForm: parsedAccount.legalForm || '',
            legalFormDisplay: parsedAccount.legalForm || '',
            economicSector: parsedAccount.economicSector || '',
            economicSectorDisplay: parsedAccount.economicSector || '',
            operationScope: parsedAccount.operationScope || '',
            operationScopeDisplay: parsedAccount.operationScope || '',
            socialCapital: parsedAccount.socialCapital || '',
            numberOfEstablishments: parsedAccount.numberOfEstablishments || '',
            numberOfEmployees: parsedAccount.numberOfEmployees || '',
            nif: parsedAccount.nif || '',
            expedientNumber: parsedAccount.expedientNumber || '',
            certificateNumber: parsedAccount.certificateNumber || '',
          });
          setAvatar(parsedAccount.avatar || null);
        } else {
          Alert.alert('Error', 'No se encontraron datos de la cuenta.');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error al inicializar datos:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos.');
      } finally {
        setIsLoading(false);
      }
    };
    initializeFormData();
  }, [account, navigation]);

  // Load selections from AsyncStorage
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

        if (formData) {
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
            }${address.postalCode ? ', ' + address.postalCode : ''}`;
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
        }
      } catch (error) {
        console.error('Error al cargar selecciones previas:', error);
      }
    };
    if (formData) {
      loadSelections();
    }
  }, [formData]);

  // Reload selections when screen regains focus
  useFocusEffect(
    useCallback(() => {
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
          const storedLegalForm = await AsyncStorage.getItem(
            'selectedLegalForm',
          );
          const storedEconomicSector = await AsyncStorage.getItem(
            'selectedEconomicSector',
          );
          const storedOperationScope = await AsyncStorage.getItem(
            'selectedOperationScope',
          );

          if (formData) {
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
              }${address.postalCode ? ', ' + address.postalCode : ''}`;
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
          }
        } catch (error) {
          console.error('Error al cargar selecciones al enfocar:', error);
        }
      };
      loadSelections();
    }, [formData]),
  );

  // Handle navigation params updates
  useEffect(() => {
    const updateFormDataFromParams = async () => {
      const updates = {};

      if (
        route.params?.categoryId &&
        route.params?.categoryName &&
        route.params?.subcategoryId &&
        route.params?.subcategoryName
      ) {
        updates.category = route.params.categoryId;
        updates.categoryName = route.params.categoryName;
        updates.subcategory = route.params.subcategoryId;
        updates.subcategoryName = route.params.subcategoryName;
        try {
          await AsyncStorage.setItem(
            'selectedCategory',
            JSON.stringify({
              _id: route.params.categoryId,
              name: route.params.categoryName,
            }),
          );
          await AsyncStorage.setItem(
            'selectedSubcategory',
            JSON.stringify({
              _id: route.params.subcategoryId,
              name: route.params.subcategoryName,
            }),
          );
        } catch (error) {
          console.error('Error al guardar categoría/subcategoría:', error);
        }
      }

      if (route.params?.addressId && route.params?.addressDetails) {
        updates.address = route.params.addressId;
        updates.addressDetails = route.params.addressDetails;
        try {
          await AsyncStorage.setItem(
            'selectedAddress',
            JSON.stringify({
              _id: route.params.addressId,
              street: route.params.street || '',
              city: route.params.city || route.params.addressDetails,
              state: route.params.state || '',
              country: route.params.country || '',
              postalCode: route.params.postalCode || '',
            }),
          );
        } catch (error) {
          console.error('Error al guardar dirección:', error);
        }
      }

      if (
        route.params?.capitalOwnershipValue &&
        route.params?.capitalOwnershipDisplay
      ) {
        updates.capitalOwnership = route.params.capitalOwnershipValue;
        updates.capitalOwnershipDisplay = route.params.capitalOwnershipDisplay;
        try {
          await AsyncStorage.setItem(
            'selectedCapitalOwnership',
            JSON.stringify({
              value: route.params.capitalOwnershipValue,
              display: route.params.capitalOwnershipDisplay,
            }),
          );
        } catch (error) {
          console.error('Error al guardar propiedad del capital:', error);
        }
      }

      if (route.params?.companySizeValue && route.params?.companySizeDisplay) {
        updates.companySize = route.params.companySizeValue;
        updates.companySizeDisplay = route.params.companySizeDisplay;
        try {
          await AsyncStorage.setItem(
            'selectedCompanySize',
            JSON.stringify({
              value: route.params.companySizeValue,
              display: route.params.companySizeDisplay,
            }),
          );
        } catch (error) {
          console.error('Error al guardar tamaño de la empresa:', error);
        }
      }

      if (route.params?.legalFormValue && route.params?.legalFormDisplay) {
        updates.legalForm = route.params.legalFormValue;
        updates.legalFormDisplay = route.params.legalFormDisplay;
        try {
          await AsyncStorage.setItem(
            'selectedLegalForm',
            JSON.stringify({
              value: route.params.legalFormValue,
              display: route.params.legalFormDisplay,
            }),
          );
        } catch (error) {
          console.error('Error al guardar forma jurídica:', error);
        }
      }

      if (
        route.params?.economicSectorValue &&
        route.params?.economicSectorDisplay
      ) {
        updates.economicSector = route.params.economicSectorValue;
        updates.economicSectorDisplay = route.params.economicSectorDisplay;
        try {
          await AsyncStorage.setItem(
            'selectedEconomicSector',
            JSON.stringify({
              value: route.params.economicSectorValue,
              display: route.params.economicSectorDisplay,
            }),
          );
        } catch (error) {
          console.error('Error al guardar sector económico:', error);
        }
      }

      if (
        route.params?.operationScopeValue &&
        route.params?.operationScopeDisplay
      ) {
        updates.operationScope = route.params.operationScopeValue;
        updates.operationScopeDisplay = route.params.operationScopeDisplay;
        try {
          await AsyncStorage.setItem(
            'selectedOperationScope',
            JSON.stringify({
              value: route.params.operationScopeValue,
              display: route.params.operationScopeDisplay,
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
    if (formData) {
      updateFormDataFromParams();
    }
  }, [route.params, formData]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const pickImage = async () => {
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

  const handleUpdate = async () => {
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
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('owner', formData.owner);
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

      if (avatar && avatar.startsWith('file://')) {
        formDataToSend.append('avatar', {
          uri: avatar,
          name: `avatar_${userId}.jpg`,
          type: 'image/jpeg',
        });
      }

      const response = await axios.put(
        `${API_BASE_URL}/professional/${formData.id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const updatedAccount = {
        id: response.data.professional._id,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        description: formData.description,
        owner: formData.owner,
        ownerName: userName,
        avatar: avatar.startsWith('file://')
          ? response.data.professional.avatar?.url
          : avatar,
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
        JSON.stringify(updatedAccount),
      );

      Alert.alert('Éxito', 'Cuenta profesional actualizada correctamente');
      navigation.goBack();
    } catch (error) {
      console.error(
        'Error al actualizar cuenta profesional:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'No se pudo actualizar la cuenta profesional. Intenta de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) {
      Alert.alert('Error', 'No se encontró el ID de la cuenta profesional.');
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar la cuenta profesional? Esta acción no se puede deshacer.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${API_BASE_URL}/professional/${formData.id}`);
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
                'Éxito',
                'Cuenta profesional eliminada correctamente',
              );
              navigation.navigate('CreateProfessionalAccount', {
                accountDeleted: 'true',
              });
            } catch (error) {
              console.error(
                'Error al eliminar cuenta profesional:',
                error.response?.data || error.message,
              );
              Alert.alert(
                'Error',
                error.response?.data?.message ||
                  'No se pudo eliminar la cuenta profesional. Intenta de nuevo.',
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  if (isLoading || !formData) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      </SafeAreaView>
    );
  }

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
                  color={COLORS.PRIMARY}
                />
              );
            })()}
        </TouchableOpacity>
        <Text style={styles.headerText}>Editar Cuenta Profesional</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Propietario*</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={userName}
            editable={false}
            placeholder="Nombre del propietario"
            placeholderTextColor={COLORS.PLACEHOLDER}
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
                returnScreen: 'EditProfessionalAccount',
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
                    color={COLORS.PLACEHOLDER}
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
                returnScreen: 'EditProfessionalAccount',
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
                    color={COLORS.PLACEHOLDER}
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
                returnScreen: 'EditProfessionalAccount',
              })
            }>
            <Text
              style={[
                styles.selectionPickerText,
                formData.capitalOwnership && styles.selectionPickerTextSelected,
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
                    color={COLORS.PLACEHOLDER}
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
                returnScreen: 'EditProfessionalAccount',
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
                    color={COLORS.PLACEHOLDER}
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
                returnScreen: 'EditProfessionalAccount',
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
                    color={COLORS.PLACEHOLDER}
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
                returnScreen: 'EditProfessionalAccount',
              })
            }>
            <Text
              style={[
                styles.selectionPickerText,
                formData.economicSector && styles.selectionPickerTextSelected,
              ]}>
              {formData.economicSectorDisplay || 'Seleccionar Sector Económico'}
            </Text>
            {ICONS.CHEVRON_RIGHT &&
              (() => {
                const ChevronRightIcon =
                  IconComponents[ICONS.CHEVRON_RIGHT.library];
                return (
                  <ChevronRightIcon
                    name={ICONS.CHEVRON_RIGHT.name}
                    size={ICONS.CHEVRON_RIGHT.size || 24}
                    color={COLORS.PLACEHOLDER}
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
              navigation.navigate(SCREENS.OPERATION_SCOPE_SCREEN, {
                returnScreen: 'EditProfessionalAccount',
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
                    color={COLORS.PLACEHOLDER}
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
            placeholderTextColor={COLORS.PLACEHOLDER}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email*</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={text => handleChange('email', text)}
            placeholder="Ej: profesional@ejemplo.com"
            placeholderTextColor={COLORS.PLACEHOLDER}
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
            placeholderTextColor={COLORS.PLACEHOLDER}
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
            placeholderTextColor={COLORS.PLACEHOLDER}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nº de Establecimientos*</Text>
          <TextInput
            style={styles.input}
            value={formData.numberOfEstablishments}
            onChangeText={text => handleChange('numberOfEstablishments', text)}
            placeholder="Ej: 1"
            placeholderTextColor={COLORS.PLACEHOLDER}
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
            placeholderTextColor={COLORS.PLACEHOLDER}
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
            placeholderTextColor={COLORS.PLACEHOLDER}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nº de Expediente*</Text>
          <TextInput
            style={styles.input}
            value={formData.expedientNumber}
            onChangeText={text => handleChange('expedientNumber', text)}
            placeholder="Ej: 05069/2024"
            placeholderTextColor={COLORS.PLACEHOLDER}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nº de Certificado*</Text>
          <TextInput
            style={styles.input}
            value={formData.certificateNumber}
            onChangeText={text => handleChange('certificateNumber', text)}
            placeholder="Ej: 3025"
            placeholderTextColor={COLORS.PLACEHOLDER}
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
            placeholderTextColor={COLORS.PLACEHOLDER}
            multiline
            numberOfLines={4}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Avatar*</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
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
                  onPress={removeImage}>
                  {ICONS.DELETE &&
                    (() => {
                      const DeleteIcon = IconComponents[ICONS.DELETE.library];
                      return (
                        <DeleteIcon
                          name={ICONS.DELETE.name}
                          size={ICONS.DELETE.size || 24}
                          color={COLORS.ERROR}
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
                        color={COLORS.PLACEHOLDER}
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
        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.updateButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleUpdate}
            disabled={loading}>
            {ICONS.UPDATE &&
              (() => {
                const UpdateIcon = IconComponents[ICONS.UPDATE.library];
                return (
                  <UpdateIcon
                    name={ICONS.UPDATE.name || 'update'}
                    size={ICONS.UPDATE.size || 24}
                    color={COLORS.WHITE}
                  />
                );
              })()}
            <Text style={styles.submitButtonText}>
              {loading ? 'Actualizando...' : 'Actualizar Cuenta Profesional'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.deleteStoreButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleDelete}
            disabled={loading}>
            {ICONS.DELETE_FOREVER &&
              (() => {
                const DeleteForeverIcon =
                  IconComponents[ICONS.DELETE_FOREVER.library];
                return (
                  <DeleteForeverIcon
                    name={ICONS.DELETE_FOREVER.name || 'delete-forever'}
                    size={ICONS.DELETE_FOREVER.size || 24}
                    color={COLORS.WHITE}
                  />
                );
              })()}
            <Text style={styles.submitButtonText}>
              Eliminar Cuenta Profesional
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfessionalAccount;
