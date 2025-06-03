import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../../config/Service.Config';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from './styles/AddScreenStyle';
import {COLORS, ICONS} from '../../constants';
import SCREENS from '../../screens';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  Ionicons: require('react-native-vector-icons/Ionicons').default,
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  Feather: require('react-native-vector-icons/Feather').default,
  AntDesign: require('react-native-vector-icons/AntDesign').default,
  MaterialCommunityIcons:
    require('react-native-vector-icons/MaterialCommunityIcons').default,
  SimpleLineIcons: require('react-native-vector-icons/SimpleLineIcons').default,
  Entypo: require('react-native-vector-icons/Entypo').default,
  Fontisto: require('react-native-vector-icons/Fontisto').default,
  FontAwesome: require('react-native-vector-icons/FontAwesome').default,
};

// Componente para el título de la ubicación
const LocationTitle = () => {
  const [city, setCity] = useState('Guinea Ecuatorial');
  const navigation = useNavigation();

  const loadCity = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      if (id) {
        const cleanUserId = id.replace(/"/g, '');
        const userKey = `user${cleanUserId}`;
        const userData = await AsyncStorage.getItem(userKey);
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          const cityName = parsedUserData.ciudad?.name || 'Guinea Ecuatorial';
          setCity(cityName);
        }
      }
    } catch (error) {
      console.error('Error loading city:', error.message);
      setCity('Guinea Ecuatorial');
    }
  };

  useEffect(() => {
    loadCity();
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

const AddScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedLocationName, setSelectedLocationName] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tiendaId, setTiendaId] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    supplier: '',
    price: '',
    description: '',
    type: 'product',
    tallas: [],
    numeros_calzado: [],
    colores: [],
    brand: '',
    condition: 'new',
    year: '',
    location: '',
    dimensions: {length: '', width: '', height: '', unit: 'cm'},
    weight: {value: '', unit: 'kg'},
    features: [],
    specifications: {},
    stock: '1',
    warranty: {duration: '', description: ''},
  });
  const [errors, setErrors] = useState({});
  const [tallaInput, setTallaInput] = useState('');
  const [numeroCalzadoInput, setNumeroCalzadoInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  // Allowed MIME types (matching backend fileFilter)
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/quicktime'];

  // Handle navigation params for category, subcategory, and location
  useEffect(() => {
    const params = route.params || {};
    if (params.categoryId && params.subcategoryId) {
      setSelectedCategory({
        _id: params.categoryId,
        name: params.categoryName,
      });
      setSelectedSubcategory({
        _id: params.subcategoryId,
        name: params.subcategoryName,
      });
      AsyncStorage.setItem(
        'selectedCategory',
        JSON.stringify({_id: params.categoryId, name: params.categoryName}),
      );
      AsyncStorage.setItem(
        'selectedSubcategory',
        JSON.stringify({
          _id: params.subcategoryId,
          name: params.subcategoryName,
        }),
      );
    }
    if (params.locationId) {
      setFormData(prev => ({...prev, location: params.locationId}));
      setSelectedLocationName(params.locationName || 'Ubicación seleccionada');
      AsyncStorage.setItem(
        'selectedLocation',
        JSON.stringify({id: params.locationId, name: params.locationName}),
      );
    }
  }, [route.params]);

  // Iconos dinámicos
  const ChevronDownIcon = IconComponents[ICONS.CHEVRON_DOWN.library];
  const AddIcon = IconComponents[ICONS.ADD.library];
  const CloseCircleIcon = IconComponents[ICONS.CLOSE_CIRCLE.library];
  const EllipsisVerticalIcon = IconComponents[ICONS.ELLIPSIS_VERTICAL.library];

  // Cargar datos iniciales
  const loadInitialData = async () => {
    try {
      setLoader(true);
      const storedUserId = await AsyncStorage.getItem('id');
      if (storedUserId) {
        const cleanUserId = storedUserId.replace(/"/g, '');
        setUserId(cleanUserId);

        const storeResponse = await axios.get(
          `${API_BASE_URL}/tienda/owner/${cleanUserId}`,
        );
        if (storeResponse.data && storeResponse.data._id) {
          setTiendaId(storeResponse.data._id);
        } else {
          Alert.alert(
            'Error',
            'No se encontró una tienda asociada a tu cuenta.',
          );
          navigation.navigate('CrearTienda');
        }
      } else {
        Alert.alert('Error', 'Debes iniciar sesión para agregar un producto.');
        navigation.navigate('Login');
      }

      const storedFormData = await AsyncStorage.getItem('addProductFormData');
      if (storedFormData) {
        setFormData(JSON.parse(storedFormData));
      }

      const storedImages = await AsyncStorage.getItem('addProductImages');
      if (storedImages) {
        setImages(JSON.parse(storedImages));
      }

      const storedVideos = await AsyncStorage.getItem('addProductVideos');
      if (storedVideos) {
        setVideos(JSON.parse(storedVideos));
      }

      const storedCategory = await AsyncStorage.getItem('selectedCategory');
      if (storedCategory) {
        setSelectedCategory(JSON.parse(storedCategory));
      }

      const storedSubcategory = await AsyncStorage.getItem(
        'selectedSubcategory',
      );
      if (storedSubcategory) {
        setSelectedSubcategory(JSON.parse(storedSubcategory));
      }

      const storedLocation = await AsyncStorage.getItem('selectedLocation');
      if (storedLocation) {
        const {id, name} = JSON.parse(storedLocation);
        setFormData(prev => ({...prev, location: id}));
        setSelectedLocationName(name);
      }

      const response = await axios.get(
        `${API_BASE_URL}/categories?type=product`,
      );
      setCategories(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      Alert.alert('Error', 'No se pudo cargar la información inicial.');
      setError('No se pudieron cargar las categorías. Inténtalo de nuevo.');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Guardar datos en AsyncStorage
  useEffect(() => {
    const saveFormData = async () => {
      try {
        await AsyncStorage.setItem(
          'addProductFormData',
          JSON.stringify(formData),
        );
        await AsyncStorage.setItem('addProductImages', JSON.stringify(images));
        await AsyncStorage.setItem('addProductVideos', JSON.stringify(videos));
      } catch (error) {
        console.error('Error al guardar datos en AsyncStorage:', error);
      }
    };
    saveFormData();
  }, [formData, images, videos]);

  // Manejar pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  // Select multiple images from gallery
  const pickImage = async () => {
    const totalFiles = images.length + videos.length;
    if (totalFiles >= 10) {
      Alert.alert('Límite alcanzado', 'No puedes agregar más de 10 archivos.');
      return;
    }

    const remainingSlots = 10 - totalFiles;
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 1,
      includeBase64: false,
      selectionLimit: remainingSlots,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image library');
        return;
      }
      if (response.errorCode) {
        console.error('Error al seleccionar imágenes:', response.errorMessage);
        Alert.alert(
          'Error',
          `No se pudieron seleccionar las imágenes: ${response.errorMessage}`,
        );
        return;
      }
      if (response.assets && response.assets.length > 0) {
        console.log(
          'Selected image assets:',
          response.assets.map(asset => ({
            uri: asset.uri,
            type: asset.type,
            fileName: asset.fileName,
          })),
        );

        const validImages = response.assets.filter(
          asset => asset.type && ALLOWED_IMAGE_TYPES.includes(asset.type),
        );
        const invalidImages = response.assets.filter(
          asset => !asset.type || !ALLOWED_IMAGE_TYPES.includes(asset.type),
        );

        if (invalidImages.length > 0) {
          const invalidTypes = invalidImages
            .map(asset => asset.type || 'desconocido')
            .join(', ');
          Alert.alert(
            'Archivos no soportados',
            `Los siguientes tipos de archivo no están permitidos: ${invalidTypes}. Solo se permiten imágenes (jpg, png, gif).`,
          );
        }

        if (validImages.length > 0) {
          const newImages = validImages.map(asset => asset.uri);
          if (totalFiles + newImages.length > 10) {
            Alert.alert('Límite alcanzado', 'Máximo 10 archivos en total.');
            return;
          }
          setImages(prevImages => [...prevImages, ...newImages]);
        }
      }
    });
  };

  // Select multiple videos from gallery
  const pickVideo = async () => {
    const totalFiles = images.length + videos.length;
    if (totalFiles >= 10) {
      Alert.alert('Límite alcanzado', 'No puedes agregar más de 10 archivos.');
      return;
    }

    const remainingSlots = 10 - totalFiles;
    const options = {
      mediaType: 'video',
      quality: 1,
      includeBase64: false,
      selectionLimit: remainingSlots,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled video library');
        return;
      }
      if (response.errorCode) {
        console.error('Error al seleccionar videos:', response.errorMessage);
        Alert.alert(
          'Error',
          `No se pudieron seleccionar los videos: ${response.errorMessage}`,
        );
        return;
      }
      if (response.assets && response.assets.length > 0) {
        console.log(
          'Selected video assets:',
          response.assets.map(asset => ({
            uri: asset.uri,
            type: asset.type,
            fileName: asset.fileName,
          })),
        );

        const validVideos = response.assets.filter(
          asset => asset.type && ALLOWED_VIDEO_TYPES.includes(asset.type),
        );
        const invalidVideos = response.assets.filter(
          asset => !asset.type || !ALLOWED_VIDEO_TYPES.includes(asset.type),
        );

        if (invalidVideos.length > 0) {
          const invalidTypes = invalidVideos
            .map(asset => asset.type || 'desconocido')
            .join(', ');
          Alert.alert(
            'Archivos no soportados',
            `Los siguientes tipos de archivo no están permitidos: ${invalidTypes}. Solo se permiten videos (mp4, mpeg, mov).`,
          );
        }

        if (validVideos.length > 0) {
          const newVideos = validVideos.map(asset => asset.uri);
          if (totalFiles + newVideos.length > 10) {
            Alert.alert('Límite alcanzado', 'Máximo 10 archivos en total.');
            return;
          }
          setVideos(prevVideos => [...prevVideos, ...newVideos]);
        }
      }
    });
  };

  // Show file picker options (image or video)
  const showFilePickerOptions = () => {
    Alert.alert(
      'Seleccionar archivos',
      'Elige una opción',
      [
        {text: 'Seleccionar Imágenes', onPress: pickImage},
        {text: 'Seleccionar Videos', onPress: pickVideo},
        {text: 'Cancelar', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const removeImage = index =>
    setImages(prev => prev.filter((_, i) => i !== index));

  const removeVideo = index =>
    setVideos(prev => prev.filter((_, i) => i !== index));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setErrors(prev => ({...prev, [field]: null}));
  };

  const handleNestedInputChange = (field, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value,
      },
    }));
    setErrors(prev => ({...prev, [field]: null}));
  };

  // Add and remove handlers for tallas, numeros_calzado, colores
  const addTalla = () => {
    if (!tallaInput.trim()) {
      Alert.alert('Error', 'Por favor ingresa una talla válida.');
      return;
    }
    if (formData.tallas.includes(tallaInput.trim())) {
      Alert.alert('Error', 'Esta talla ya ha sido agregada.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      tallas: [...prev.tallas, tallaInput.trim()],
    }));
    setTallaInput('');
  };

  const removeTalla = talla => {
    setFormData(prev => ({
      ...prev,
      tallas: prev.tallas.filter(t => t !== talla),
    }));
  };

  const addNumeroCalzado = () => {
    const numero = parseInt(numeroCalzadoInput.trim());
    if (isNaN(numero) || numero <= 0) {
      Alert.alert('Error', 'Por favor ingresa un número de calzado válido.');
      return;
    }
    if (formData.numeros_calzado.includes(numero)) {
      Alert.alert('Error', 'Este número de calzado ya ha sido agregado.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      numeros_calzado: [...prev.numeros_calzado, numero],
    }));
    setNumeroCalzadoInput('');
  };

  const removeNumeroCalzado = numero => {
    setFormData(prev => ({
      ...prev,
      numeros_calzado: prev.numeros_calzado.filter(n => n !== numero),
    }));
  };

  const addColor = () => {
    if (!colorInput.trim()) {
      Alert.alert('Error', 'Por favor ingresa un color válido.');
      return;
    }
    if (formData.colores.includes(colorInput.trim())) {
      Alert.alert('Error', 'Este color ya ha sido agregado.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      colores: [...prev.colores, colorInput.trim()],
    }));
    setColorInput('');
  };

  const removeColor = color => {
    setFormData(prev => ({
      ...prev,
      colores: prev.colores.filter(c => c !== color),
    }));
  };

  const clearForm = async () => {
    setFormData({
      title: '',
      supplier: '',
      price: '',
      description: '',
      type: 'product',
      tallas: [],
      numeros_calzado: [],
      colores: [],
      brand: '',
      condition: 'new',
      year: '',
      location: '',
      dimensions: {length: '', width: '', height: '', unit: 'cm'},
      weight: {value: '', unit: 'kg'},
      features: [],
      specifications: {},
      stock: '1',
      warranty: {duration: '', description: ''},
    });
    setImages([]);
    setVideos([]);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedLocationName('');
    setTallaInput('');
    setNumeroCalzadoInput('');
    setColorInput('');
    setErrors({});
    try {
      await AsyncStorage.multiRemove([
        'addProductFormData',
        'addProductImages',
        'addProductVideos',
        'selectedCategory',
        'selectedSubcategory',
        'selectedLocation',
      ]);
    } catch (error) {
      console.error('Error al limpiar AsyncStorage:', error);
    }
    setMenuVisible(false);
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['title', 'supplier', 'price', 'description'];

    requiredFields.forEach(key => {
      if (!formData[key]) {
        newErrors[key] = 'Este campo es obligatorio';
      }
    });

    if (!selectedCategory) {
      newErrors.category = 'Debes seleccionar una categoría';
    }

    if (!selectedSubcategory) {
      newErrors.subcategory = 'Debes seleccionar una subcategoría';
    }

    if (images.length === 0 && videos.length === 0) {
      newErrors.files = 'Debes agregar al menos un archivo (imagen o video)';
    }

    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'El precio debe ser un número válido';
    }

    if (
      formData.year &&
      (isNaN(formData.year) ||
        formData.year < 1900 ||
        formData.year > new Date().getFullYear() + 1)
    ) {
      newErrors.year =
        'El año debe estar entre 1900 y ' + (new Date().getFullYear() + 1);
    }

    if (formData.dimensions.length && isNaN(formData.dimensions.length)) {
      newErrors.dimensions = 'La longitud debe ser un número';
    }
    if (formData.dimensions.width && isNaN(formData.dimensions.width)) {
      newErrors.dimensions = 'El ancho debe ser un número';
    }
    if (formData.dimensions.height && isNaN(formData.dimensions.height)) {
      newErrors.dimensions = 'La altura debe ser un número';
    }

    if (formData.weight.value && isNaN(formData.weight.value)) {
      newErrors.weight = 'El peso debe ser un número';
    }

    if (
      formData.stock &&
      (isNaN(formData.stock) || parseInt(formData.stock) < 0)
    ) {
      newErrors.stock = 'El stock debe ser un número no negativo';
    }

    if (formData.warranty.duration && isNaN(formData.warranty.duration)) {
      newErrors.warranty = 'La duración de la garantía debe ser un número';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const AddPost = async () => {
    if (!validateForm()) {
      return;
    }

    setLoader(true);
    try {
      const endpoint = `${API_BASE_URL}/products/${userId}`;
      console.log('Sending request to:', endpoint);

      const formDataToSend = new FormData();

      // Append simple fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('supplier', formData.supplier);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category', selectedCategory._id);
      formDataToSend.append('subcategory', selectedSubcategory._id);
      formDataToSend.append('tienda', tiendaId);

      // Append array fields
      if (formData.tallas.length > 0) {
        formDataToSend.append('tallas', JSON.stringify(formData.tallas));
      }
      if (formData.numeros_calzado.length > 0) {
        formDataToSend.append(
          'numeros_calzado',
          JSON.stringify(formData.numeros_calzado),
        );
      }
      if (formData.colores.length > 0) {
        formDataToSend.append('colores', JSON.stringify(formData.colores));
      }
      if (formData.features.length > 0) {
        formDataToSend.append('features', JSON.stringify(formData.features));
      }

      // Append new fields
      if (formData.brand) {
        formDataToSend.append('brand', formData.brand);
      }
      formDataToSend.append('condition', formData.condition);
      if (formData.year) {
        formDataToSend.append('year', formData.year);
      }
      if (formData.location) {
        formDataToSend.append('location', formData.location);
      }
      if (
        formData.dimensions.length ||
        formData.dimensions.width ||
        formData.dimensions.height
      ) {
        formDataToSend.append(
          'dimensions',
          JSON.stringify({
            length: formData.dimensions.length
              ? parseFloat(formData.dimensions.length)
              : undefined,
            width: formData.dimensions.width
              ? parseFloat(formData.dimensions.width)
              : undefined,
            height: formData.dimensions.height
              ? parseFloat(formData.dimensions.height)
              : undefined,
            unit: formData.dimensions.unit,
          }),
        );
      }
      if (formData.weight.value) {
        formDataToSend.append(
          'weight',
          JSON.stringify({
            value: parseFloat(formData.weight.value),
            unit: formData.weight.unit,
          }),
        );
      }
      if (Object.keys(formData.specifications).length > 0) {
        formDataToSend.append(
          'specifications',
          JSON.stringify(formData.specifications),
        );
      }
      formDataToSend.append('stock', formData.stock);
      if (formData.warranty.duration || formData.warranty.description) {
        formDataToSend.append(
          'warranty',
          JSON.stringify({
            duration: formData.warranty.duration
              ? parseInt(formData.warranty.duration)
              : undefined,
            description: formData.warranty.description || undefined,
          }),
        );
      }

      // Append images
      images.forEach((uri, index) => {
        const fileExtension = uri.split('.').pop().toLowerCase();
        const mimeType =
          fileExtension === 'jpg'
            ? 'image/jpeg'
            : fileExtension === 'png'
            ? 'image/png'
            : fileExtension === 'gif'
            ? 'image/gif'
            : 'image/jpeg';
        console.log(`Appending image ${index}:`, {
          uri,
          mimeType,
          name: `image-${Date.now()}-${index}.${fileExtension}`,
        });
        formDataToSend.append('images', {
          uri,
          name: `image-${Date.now()}-${index}.${fileExtension}`,
          type: mimeType,
        });
      });

      // Append videos
      videos.forEach((uri, index) => {
        const fileExtension = uri.split('.').pop().toLowerCase();
        const mimeType =
          fileExtension === 'mp4'
            ? 'video/mp4'
            : fileExtension === 'mpeg'
            ? 'video/mpeg'
            : fileExtension === 'mov'
            ? 'video/quicktime'
            : 'video/mp4';
        console.log(`Appending video ${index}:`, {
          uri,
          mimeType,
          name: `video-${Date.now()}-${index}.${fileExtension}`,
        });
        formDataToSend.append('videos', {
          uri,
          name: `video-${Date.now()}-${index}.${fileExtension}`,
          type: mimeType,
        });
      });

      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        const productId = response.data.product._id;
        await axios.patch(`${API_BASE_URL}/tienda/${tiendaId}/add-product`, {
          productId,
        });
        await clearForm();
        await AsyncStorage.removeItem('products_data');
        Alert.alert('Éxito', 'Producto agregado exitosamente.', [
          {
            text: 'OK',
            onPress: () => navigation.replace(SCREENS.ADD_SCREENS),
          },
        ]);
      }
    } catch (error) {
      console.error('Error al agregar producto:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      let errorMessage = 'Error al agregar el producto.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoader(false);
    }
  };

  if (!userId || !tiendaId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          {loader ? (
            <ActivityIndicator size="large" color={COLORS.green} />
          ) : (
            <Text style={styles.errorText}>
              Debes iniciar sesión y tener una tienda para agregar un producto.
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <LocationTitle />
          <Text style={styles.headerText}>Agregar Producto</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <EllipsisVerticalIcon
            name={ICONS.ELLIPSIS_VERTICAL.name}
            size={styles.iconSize}
            color={COLORS.black}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.green]}
            />
          }>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría *</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() =>
                navigation.navigate(SCREENS.CATEGORY_SELECTION_SCREEN, {
                  selectedCategory: selectedCategory
                    ? JSON.stringify(selectedCategory)
                    : null,
                })
              }>
              <Text style={styles.selectorText}>
                {selectedSubcategory?.name || 'Seleccionar categoría'}
              </Text>
              <ChevronDownIcon
                name={ICONS.CHEVRON_DOWN.name}
                size={styles.iconSize}
                color={COLORS.gray}
              />
            </TouchableOpacity>
            {errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
            {errors.subcategory && (
              <Text style={styles.errorText}>{errors.subcategory}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Imágenes y Videos *</Text>
            <View style={styles.imageSelectionContainer}>
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={showFilePickerOptions}>
                <AddIcon
                  name={ICONS.ADD.name}
                  size={styles.iconSize}
                  color={COLORS.green}
                />
              </TouchableOpacity>
              {(images.length > 0 || videos.length > 0) && (
                <FlatList
                  data={[...images, ...videos]}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `${item}-${index}`}
                  initialNumToRender={3}
                  windowSize={5}
                  renderItem={({item, index}) => {
                    const isVideo = videos.includes(item);
                    return (
                      <View style={styles.imageWrapper}>
                        {isVideo ? (
                          <Video
                            source={{uri: item}}
                            style={styles.image}
                            resizeMode="cover"
                            paused={true}
                            repeat={false}
                          />
                        ) : (
                          <Image source={{uri: item}} style={styles.image} />
                        )}
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => {
                            if (isVideo) {
                              removeVideo(videos.indexOf(item));
                            } else {
                              removeImage(images.indexOf(item));
                            }
                          }}>
                          <CloseCircleIcon
                            name={ICONS.CLOSE_CIRCLE.name}
                            size={styles.iconSize}
                            color={COLORS.red}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  contentContainerStyle={{paddingHorizontal: 10}}
                />
              )}
            </View>
            <Text style={styles.infoText}>
              La primera imagen será la principal. Máximo 10 archivos (imágenes
              o videos).{'\n'}
              Formatos soportados: jpg, png, gif, mp4, mpeg, mov. Cada archivo
              no debe exceder 40 MB.
            </Text>
            {errors.files && (
              <Text style={styles.errorText}>{errors.files}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Título del producto"
              value={formData.title}
              onChangeText={text => handleInputChange('title', text)}
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[styles.inputText, styles.textArea]}
              placeholder="Describe tu producto..."
              value={formData.description}
              onChangeText={text => handleInputChange('description', text)}
              multiline
              numberOfLines={4}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre del proveedor *</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Nombre del proveedor"
              value={formData.supplier}
              onChangeText={text => handleInputChange('supplier', text)}
            />
            {errors.supplier && (
              <Text style={styles.errorText}>{errors.supplier}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Precio *</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Precio del producto"
              value={formData.price}
              onChangeText={text => handleInputChange('price', text)}
              keyboardType="numeric"
            />
            {errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tallas (opcional)</Text>
            <View style={styles.inlineInputs}>
              <TextInput
                style={[styles.inputText, styles.inlineInput]}
                placeholder="Ej: S, M, L"
                value={tallaInput}
                onChangeText={setTallaInput}
              />
              <TouchableOpacity style={styles.addButton} onPress={addTalla}>
                <AddIcon
                  name={ICONS.ADD.name}
                  size={styles.iconSize}
                  color={COLORS.green}
                />
              </TouchableOpacity>
            </View>
            {formData.tallas.length > 0 && (
              <View style={styles.tagContainer}>
                {formData.tallas.map((talla, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{talla}</Text>
                    <TouchableOpacity onPress={() => removeTalla(talla)}>
                      <CloseCircleIcon
                        name={ICONS.CLOSE_CIRCLE.name}
                        size={styles.iconSize}
                        color={COLORS.red}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Números de calzado (opcional)</Text>
            <View style={styles.inlineInputs}>
              <TextInput
                style={[styles.inputText, styles.inlineInput]}
                placeholder="Ej: 38, 39, 40"
                value={numeroCalzadoInput}
                onChangeText={setNumeroCalzadoInput}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={addNumeroCalzado}>
                <AddIcon
                  name={ICONS.ADD.name}
                  size={styles.iconSize}
                  color={COLORS.green}
                />
              </TouchableOpacity>
            </View>
            {formData.numeros_calzado.length > 0 && (
              <View style={styles.tagContainer}>
                {formData.numeros_calzado.map((numero, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{numero}</Text>
                    <TouchableOpacity
                      onPress={() => removeNumeroCalzado(numero)}>
                      <CloseCircleIcon
                        name={ICONS.CLOSE_CIRCLE.name}
                        size={styles.iconSize}
                        color={COLORS.red}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Colores (opcional)</Text>
            <View style={styles.inlineInputs}>
              <TextInput
                style={[styles.inputText, styles.inlineInput]}
                placeholder="Ej: Rojo, Azul, Verde"
                value={colorInput}
                onChangeText={setColorInput}
              />
              <TouchableOpacity style={styles.addButton} onPress={addColor}>
                <AddIcon
                  name={ICONS.ADD.name}
                  size={styles.iconSize}
                  color={COLORS.green}
                />
              </TouchableOpacity>
            </View>
            {formData.colores.length > 0 && (
              <View style={styles.tagContainer}>
                {formData.colores.map((color, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{color}</Text>
                    <TouchableOpacity onPress={() => removeColor(color)}>
                      <CloseCircleIcon
                        name={ICONS.CLOSE_CIRCLE.name}
                        size={styles.iconSize}
                        color={COLORS.red}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Marca (opcional)</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Ej: Samsung, Toyota"
              value={formData.brand}
              onChangeText={text => handleInputChange('brand', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Condición (opcional)</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => {
                Alert.alert(
                  'Seleccionar condición',
                  'Elige una opción',
                  [
                    {
                      text: 'Nuevo',
                      onPress: () => handleInputChange('condition', 'new'),
                    },
                    {
                      text: 'Usado',
                      onPress: () => handleInputChange('condition', 'used'),
                    },
                    {
                      text: 'Reacondicionado',
                      onPress: () =>
                        handleInputChange('condition', 'refurbished'),
                    },
                    {text: 'Cancelar', style: 'cancel'},
                  ],
                  {cancelable: true},
                );
              }}>
              <Text style={styles.selectorText}>
                {formData.condition === 'new'
                  ? 'Nuevo'
                  : formData.condition === 'used'
                  ? 'Usado'
                  : formData.condition === 'refurbished'
                  ? 'Reacondicionado'
                  : 'Seleccionar condición'}
              </Text>
              <ChevronDownIcon
                name={ICONS.CHEVRON_DOWN.name}
                size={styles.iconSize}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Año (opcional)</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Ej: 2023"
              value={formData.year}
              onChangeText={text => handleInputChange('year', text)}
              keyboardType="numeric"
            />
            {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ubicación (opcional)</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() =>
                navigation.navigate(SCREENS.SELECT_CITY_SCREEN, {
                  selectedLocation: formData.location,
                })
              }>
              <Text style={styles.selectorText}>
                {selectedLocationName || 'Seleccionar ubicación'}
              </Text>
              <ChevronDownIcon
                name={ICONS.CHEVRON_DOWN.name}
                size={styles.iconSize}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dimensiones (opcional)</Text>
            <View style={styles.inlineInputs}>
              <TextInput
                style={[styles.inputText, styles.inlineInput]}
                placeholder="Longitud (cm)"
                value={formData.dimensions.length}
                onChangeText={text =>
                  handleNestedInputChange('dimensions', 'length', text)
                }
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.inputText, styles.inlineInput]}
                placeholder="Ancho (cm)"
                value={formData.dimensions.width}
                onChangeText={text =>
                  handleNestedInputChange('dimensions', 'width', text)
                }
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.inputText, styles.inlineInput]}
                placeholder="Altura (cm)"
                value={formData.dimensions.height}
                onChangeText={text =>
                  handleNestedInputChange('dimensions', 'height', text)
                }
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => {
                Alert.alert(
                  'Seleccionar unidad',
                  'Elige una opción',
                  [
                    {
                      text: 'cm',
                      onPress: () =>
                        handleNestedInputChange('dimensions', 'unit', 'cm'),
                    },
                    {
                      text: 'm',
                      onPress: () =>
                        handleNestedInputChange('dimensions', 'unit', 'm'),
                    },
                    {
                      text: 'in',
                      onPress: () =>
                        handleNestedInputChange('dimensions', 'unit', 'in'),
                    },
                    {
                      text: 'ft',
                      onPress: () =>
                        handleNestedInputChange('dimensions', 'unit', 'ft'),
                    },
                    {text: 'Cancelar', style: 'cancel'},
                  ],
                  {cancelable: true},
                );
              }}>
              <Text style={styles.selectorText}>
                {formData.dimensions.unit || 'Unidad'}
              </Text>
              <ChevronDownIcon
                name={ICONS.CHEVRON_DOWN.name}
                size={styles.iconSize}
                color={COLORS.gray}
              />
            </TouchableOpacity>
            {errors.dimensions && (
              <Text style={styles.errorText}>{errors.dimensions}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Peso (opcional)</Text>
            <View style={styles.inlineInputs}>
              <TextInput
                style={[styles.inputText, styles.inlineInput]}
                placeholder="Peso"
                value={formData.weight.value}
                onChangeText={text =>
                  handleNestedInputChange('weight', 'value', text)
                }
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.selectorButton, styles.inlineInput]}
                onPress={() => {
                  Alert.alert(
                    'Seleccionar unidad',
                    'Elige una opción',
                    [
                      {
                        text: 'g',
                        onPress: () =>
                          handleNestedInputChange('weight', 'unit', 'g'),
                      },
                      {
                        text: 'kg',
                        onPress: () =>
                          handleNestedInputChange('weight', 'unit', 'kg'),
                      },
                      {
                        text: 'lb',
                        onPress: () =>
                          handleNestedInputChange('weight', 'unit', 'lb'),
                      },
                      {text: 'Cancelar', style: 'cancel'},
                    ],
                    {cancelable: true},
                  );
                }}>
                <Text style={styles.selectorText}>
                  {formData.weight.unit || 'Unidad'}
                </Text>
                <ChevronDownIcon
                  name={ICONS.CHEVRON_DOWN.name}
                  size={styles.iconSize}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
            {errors.weight && (
              <Text style={styles.errorText}>{errors.weight}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Características (opcional)</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Ej: 4K, cuero, automático (separar por comas)"
              value={formData.features.join(', ')}
              onChangeText={text =>
                handleInputChange(
                  'features',
                  text
                    .split(',')
                    .map(f => f.trim())
                    .filter(f => f),
                )
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Especificaciones (opcional)</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Ej: RAM: 16GB, Motor: V8 (clave: valor, separar por comas)"
              value={Object.entries(formData.specifications)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ')}
              onChangeText={text => {
                const specs = {};
                text.split(',').forEach(pair => {
                  const [key, value] = pair.split(':').map(s => s.trim());
                  if (key && value) specs[key] = value;
                });
                handleInputChange('specifications', specs);
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Stock (opcional)</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Ej: 10"
              value={formData.stock}
              onChangeText={text => handleInputChange('stock', text)}
              keyboardType="numeric"
            />
            {errors.stock && (
              <Text style={styles.errorText}>{errors.stock}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Garantía (opcional)</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Duración en meses"
              value={formData.warranty.duration}
              onChangeText={text =>
                handleNestedInputChange('warranty', 'duration', text)
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.inputText}
              placeholder="Descripción de la garantía"
              value={formData.warranty.description}
              onChangeText={text =>
                handleNestedInputChange('warranty', 'description', text)
              }
            />
            {errors.warranty && (
              <Text style={styles.errorText}>{errors.warranty}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loader && styles.submitButtonDisabled]}
            onPress={AddPost}
            disabled={loader}>
            {loader ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Publicar Producto</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                clearForm();
              }}>
              <Text style={styles.menuItemText}>Eliminar todo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.goBack();
              }}>
              <Text style={styles.menuItemText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default AddScreen;
