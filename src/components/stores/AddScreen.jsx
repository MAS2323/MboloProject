import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../../config/Service.Config';
import {useNavigation} from '@react-navigation/native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import styles from './styles/AddScreenStyle';
import {COLORS, ICONS} from '../../constants';

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
    <TouchableOpacity onPress={() => navigation.navigate('SelectCityScreen')}>
      <Text style={styles.locationTitle}>{city}</Text>
    </TouchableOpacity>
  );
};

const AddScreen = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
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
  });
  const [errors, setErrors] = useState({});

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

  const requestPermissions = async () => {
    try {
      const permissions = Platform.select({
        ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY],
        android: [
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ],
      });

      const results = await Promise.all(
        permissions.map(permission =>
          check(permission).then(result => {
            if (result === RESULTS.DENIED) {
              return request(permission);
            }
            return result;
          }),
        ),
      );

      if (results.some(result => result !== RESULTS.GRANTED)) {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos permisos para acceder a la galería y la cámara.',
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const takePhoto = async () => {
    try {
      const totalFiles = images.length + videos.length;
      if (totalFiles >= 10) {
        Alert.alert('Límite alcanzado', 'No puedes agregar más de 10 archivos');
        return;
      }

      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      launchCamera(
        {
          mediaType: 'photo',
          quality: 1,
          includeBase64: false,
        },
        response => {
          if (response.didCancel) return;
          if (response.errorCode) {
            console.error('Camera error:', response.errorMessage);
            return;
          }
          if (response.assets?.length > 0) {
            const newImages = response.assets.map(asset => asset.uri);
            if (totalFiles + newImages.length > 10) {
              Alert.alert('Límite alcanzado', 'Máximo 10 archivos en total');
              return;
            }
            setImages(prevImages => [...prevImages, ...newImages]);
          }
        },
      );
    } catch (error) {
      console.error('Error tomando foto:', error);
    }
  };

  const pickFiles = async () => {
    try {
      const totalFiles = images.length + videos.length;
      if (totalFiles >= 10) {
        Alert.alert('Límite alcanzado', 'No puedes agregar más de 10 archivos');
        return;
      }

      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      launchImageLibrary(
        {
          mediaType: 'mixed',
          quality: 1,
          selectionLimit: 10 - totalFiles,
          includeBase64: false,
        },
        response => {
          if (response.didCancel) return;
          if (response.errorCode) {
            console.error('Image library error:', response.errorMessage);
            return;
          }
          if (response.assets?.length > 0) {
            const selectedFiles = response.assets;
            const newImages = [];
            const newVideos = [];

            selectedFiles.forEach(asset => {
              if (asset.type?.includes('video')) {
                newVideos.push(asset.uri);
              } else {
                newImages.push(asset.uri);
              }
            });

            const totalNewFiles = newImages.length + newVideos.length;
            if (totalFiles + totalNewFiles > 10) {
              Alert.alert(
                'Límite excedido',
                `Solo puedes seleccionar ${10 - totalFiles} archivo(s) más.`,
              );
              return;
            }

            setImages(prevImages => [...prevImages, ...newImages]);
            setVideos(prevVideos => [...prevVideos, ...newVideos]);
          }
        },
      );
    } catch (error) {
      console.error('Error seleccionando archivos:', error);
    }
  };

  const showFilePickerOptions = () => {
    Alert.alert(
      'Seleccionar archivo',
      'Elige una opción',
      [
        {text: 'Seleccionar de Galería', onPress: pickFiles},
        {text: 'Tomar una foto', onPress: takePhoto},
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
    });
    setImages([]);
    setVideos([]);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setErrors({});
    try {
      await AsyncStorage.removeItem('addProductFormData');
      await AsyncStorage.removeItem('addProductImages');
      await AsyncStorage.removeItem('addProductVideos');
      await AsyncStorage.removeItem('selectedCategory');
      await AsyncStorage.removeItem('selectedSubcategory');
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

      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          if (Array.isArray(formData[key])) {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      formDataToSend.append('category', selectedCategory._id);
      formDataToSend.append('subcategory', selectedSubcategory._id);
      formDataToSend.append('tienda', tiendaId);

      images.forEach((uri, index) => {
        const fileExtension = uri.split('.').pop().toLowerCase();
        const mimeType = `image/${
          fileExtension === 'jpg' ? 'jpeg' : fileExtension
        }`;
        console.log(`Appending image ${index}:`, {uri, mimeType});
        formDataToSend.append('images', {
          uri,
          name: `image-${Date.now()}-${index}.${fileExtension}`,
          type: mimeType,
        });
      });

      videos.forEach((uri, index) => {
        const fileExtension = uri.split('.').pop().toLowerCase();
        console.log(`Appending video ${index}:`, {
          uri,
          type: `video/${fileExtension}`,
        });
        formDataToSend.append('videos', {
          uri,
          name: `video-${Date.now()}-${index}.${fileExtension}`,
          type: `video/${fileExtension}`,
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
        Alert.alert('Éxito', 'Producto agregado exitosamente', [
          {
            text: 'OK',
            onPress: () => navigation.replace('Tabs'),
          },
        ]);
      }
    } catch (error) {
      console.error('Error al agregar el producto:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Error al agregar el producto.',
      );
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
            <Text style={styles.message}>
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
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <LocationTitle />
          <Text style={styles.headerTitle}>Agregar Producto</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <EllipsisVerticalIcon
            name={ICONS.ELLIPSIS_VERTICAL.name}
            size={ICONS.ELLIPSIS_VERTICAL.size}
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
              tintColor={COLORS.green}
            />
          }>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Categoría *</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() =>
                navigation.navigate('SubcategoriesScreen', {
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
                size={ICONS.CHEVRON_DOWN.size}
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
            <Text style={styles.label}>Imágenes y Videos</Text>
            <View style={styles.imageSelectionContainer}>
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={showFilePickerOptions}>
                <AddIcon
                  name={ICONS.ADD.name}
                  size={ICONS.ADD.size}
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
                            size={ICONS.CLOSE_CIRCLE.size}
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
              Formatos soportados: jpg, gif, png, mp4, mpeg, mov. Cada archivo
              no debe exceder 10 Mb.
            </Text>
            {errors.files && (
              <Text style={styles.errorText}>{errors.files}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
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
              style={[styles.input, styles.textArea]}
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
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
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
              style={styles.input}
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
            <TextInput
              style={styles.input}
              placeholder="Ej: S, M, L (separar por comas)"
              value={formData.tallas.join(', ')}
              onChangeText={text =>
                handleInputChange(
                  'tallas',
                  text.split(',').map(t => t.trim()),
                )
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Números de calzado (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 38, 39, 40 (separar por comas)"
              value={formData.numeros_calzado.join(', ')}
              onChangeText={text =>
                handleInputChange(
                  'numeros_calzado',
                  text
                    .split(',')
                    .map(n => parseInt(n.trim()))
                    .filter(n => !isNaN(n)),
                )
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Colores (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Rojo, Azul, Verde (separar por comas)"
              value={formData.colores.join(', ')}
              onChangeText={text =>
                handleInputChange(
                  'colores',
                  text.split(',').map(c => c.trim()),
                )
              }
            />
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
