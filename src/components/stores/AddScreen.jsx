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

  // Allowed MIME types (matching backend fileFilter)
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/quicktime'];

  // Handle navigation params for category and subcategory
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
      await AsyncStorage.multiRemove([
        'addProductFormData',
        'addProductImages',
        'addProductVideos',
        'selectedCategory',
        'selectedSubcategory',
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
            <Text style={styles.label}>Nombre *</Text>
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
            <TextInput
              style={styles.inputText}
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
              style={styles.inputText}
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
              style={styles.inputText}
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
