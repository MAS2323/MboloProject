import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import {API_BASE_URL} from '../../config/Service.Config';
import styles from './styles/ProductEditionStyle';
import {COLORS, ICONS} from '../../constants';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  Feather: require('react-native-vector-icons/Feather').default,
  Ionicons: require('react-native-vector-icons/Ionicons').default,
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  AntDesign: require('react-native-vector-icons/AntDesign').default,
  FontAwesome: require('react-native-vector-icons/FontAwesome').default,
  MaterialCommunityIcons:
    require('react-native-vector-icons/MaterialCommunityIcons').default,
  SimpleLineIcons: require('react-native-vector-icons/SimpleLineIcons').default,
  Entypo: require('react-native-vector-icons/Entypo').default,
  Fontisto: require('react-native-vector-icons/Fontisto').default,
};

const ProductEdition = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [editedProduct, setEditedProduct] = useState(null);

  // Definir los componentes de íconos específicos
  const AddCircleIcon = IconComponents[ICONS.ADDCIRCLE.library];
  const CloseCircleIcon = IconComponents[ICONS.CLOSE_CIRCLE.library];
  const SaveOutlineIcon = IconComponents[ICONS.SAVE_OUTLINE.library];
  const BackArrowIcon = IconComponents[ICONS.BACK_ARROW.library];

  // Cargar el producto cuando el componente se monta
  useEffect(() => {
    const item = route.params?.item;
    if (item) {
      try {
        const parsedProduct =
          typeof item === 'string' ? JSON.parse(item) : item;
        setEditedProduct({
          ...parsedProduct,
          domicilio: parsedProduct.domicilio || {name: ''},
        });
        setImages(parsedProduct.images?.map(img => img.url) || []);
        setLoading(false);
      } catch (error) {
        console.error('Error al parsear el producto:', error);
        Alert.alert(
          'Error',
          'No se pudo cargar el producto. Intenta de nuevo.',
        );
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'No se proporcionaron datos del producto.');
      setLoading(false);
    }
  }, [route.params?.item]);

  // Función para solicitar permisos
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      return true; // react-native-image-picker maneja permisos automáticamente
    }
    return true; // En iOS, permisos en Info.plist
  };

  // Función para seleccionar imágenes desde la galería
  const pickImages = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await launchImageLibrary({
        mediaType: 'photo',
        allowsEditing: false,
        quality: 1,
        selectionLimit: 0,
      });

      if (!result.didCancel && result.assets?.length > 0) {
        const selectedImages = result.assets.map(asset => asset.uri);
        if (images.length + selectedImages.length > 6) {
          Alert.alert(
            'Límite alcanzado',
            'Solo puedes subir un máximo de 6 imágenes.',
          );
          return;
        }
        setImages(prevImages => [...prevImages, ...selectedImages]);
      }
    } catch (error) {
      console.error('Error seleccionando imágenes:', error);
    }
  };

  // Función para tomar una foto
  const takePhoto = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await launchCamera({
        mediaType: 'photo',
        allowsEditing: false,
        quality: 1,
      });

      if (!result.didCancel && result.assets?.length > 0) {
        if (images.length + result.assets.length > 6) {
          Alert.alert(
            'Límite alcanzado',
            'Solo puedes subir un máximo de 6 imágenes.',
          );
          return;
        }
        setImages(prevImages => [
          ...prevImages,
          ...result.assets.map(asset => asset.uri),
        ]);
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
    }
  };

  // Función para mostrar las opciones de selección de imágenes
  const showImagePickerOptions = () => {
    Alert.alert(
      'Seleccionar imagen',
      'Elige una opción',
      [
        {text: 'Seleccionar de Galería', onPress: pickImages},
        {text: 'Tomar una foto', onPress: takePhoto},
        {text: 'Cancelar', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  // Función para eliminar una imagen
  const removeImage = index => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // Función para manejar cambios en los campos de entrada
  const handleInputChange = (field, value) => {
    setEditedProduct(prevProduct => ({
      ...prevProduct,
      [field]: value,
    }));
  };

  // Función para guardar los cambios
  const handleSave = async () => {
    try {
      if (!editedProduct?._id) {
        Alert.alert('Error', 'El producto no tiene un ID válido.');
        return;
      }

      const updatedData = {
        title: editedProduct.title,
        price: editedProduct.price,
        domicilio: editedProduct.domicilio,
        description: editedProduct.description,
        product_location: editedProduct.product_location,
        phoneNumber: editedProduct.phoneNumber,
        whatsapp: editedProduct.whatsapp,
        images: images.map(url => ({url})),
      };

      const response = await axios.put(
        `${API_BASE_URL}/products/${editedProduct._id}`,
        updatedData,
      );

      if (response.status === 200) {
        Alert.alert('Éxito', 'Producto actualizado correctamente.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'No se pudo actualizar el producto.');
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      Alert.alert('Error', 'Ocurrió un error al actualizar el producto.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary || '#007AFF'} />
      </View>
    );
  }

  if (!editedProduct) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se pudo cargar el producto.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header fijo */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => navigation.goBack()}>
          <BackArrowIcon
            name={ICONS.BACK_ARROW.name}
            size={ICONS.BACK_ARROW.size}
            color={COLORS.primary || '#007AFF'}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Actualizar producto</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <SaveOutlineIcon
            name={ICONS.SAVE_OUTLINE.name}
            size={ICONS.SAVE_OUTLINE.size}
            color={COLORS.primary || '#007AFF'}
          />
        </TouchableOpacity>
      </View>

      {/* Contenido desplazable */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Contenedor para seleccionar y mostrar imágenes */}
          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>Imágenes del producto</Text>
            <View style={styles.imageSelectionContainer}>
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={showImagePickerOptions}>
                <AddCircleIcon
                  name={ICONS.ADDCIRCLE.name}
                  size={ICONS.ADDCIRCLE.size}
                  color={COLORS.primary || '#007AFF'}
                />
              </TouchableOpacity>
              <FlatList
                data={images}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <View style={styles.imageWrapper}>
                    <Image source={{uri: item}} style={styles.image} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeImage(index)}>
                      <CloseCircleIcon
                        name={ICONS.CLOSE_CIRCLE.name}
                        size={ICONS.CLOSE_CIRCLE.size}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                )}
                contentContainerStyle={styles.imageList}
              />
            </View>
            <Text style={styles.infoText}>
              Puedes subir un máximo de 6 imágenes
            </Text>
          </View>

          {/* Campos editables */}
          <View style={styles.details}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Título</Text>
              <TextInput
                style={styles.titleInput}
                value={editedProduct.title}
                onChangeText={text => handleInputChange('title', text)}
                placeholder="Título del producto"
                placeholderTextColor={COLORS.placeholder || '#999'}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Precio</Text>
              <TextInput
                style={styles.priceInput}
                value={editedProduct.price?.toString()}
                onChangeText={text => handleInputChange('price', text)}
                placeholder="Precio"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholder || '#999'}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Descripción</Text>
              <TextInput
                style={styles.descriptionInput}
                value={editedProduct.description}
                onChangeText={text => handleInputChange('description', text)}
                placeholder="Descripción del producto"
                multiline
                numberOfLines={4}
                placeholderTextColor={COLORS.placeholder || '#999'}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ubicación</Text>
              <TextInput
                style={styles.locationInput}
                value={editedProduct.product_location?.name || ''}
                onChangeText={text =>
                  handleInputChange('product_location', {name: text})
                }
                placeholder="Ubicación del producto"
                editable={false}
                placeholderTextColor={COLORS.placeholder || '#999'}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Domicilio</Text>
              <TextInput
                style={styles.locationInput}
                value={editedProduct.domicilio?.name || ''}
                onChangeText={text =>
                  handleInputChange('domicilio', {name: text})
                }
                placeholder="Barrio, calle, zona..."
                placeholderTextColor={COLORS.placeholder || '#999'}
              />
            </View>

            <View style={styles.contactRow}>
              <View
                style={[styles.inputContainer, styles.contactInputContainer]}>
                <Text style={styles.inputLabel}>Teléfono</Text>
                <TextInput
                  style={styles.contactInput}
                  value={editedProduct.phoneNumber}
                  onChangeText={text => handleInputChange('phoneNumber', text)}
                  placeholder="Número de teléfono"
                  keyboardType="phone-pad"
                  placeholderTextColor={COLORS.placeholder || '#999'}
                />
              </View>
              <View
                style={[styles.inputContainer, styles.contactInputContainer]}>
                <Text style={styles.inputLabel}>WhatsApp</Text>
                <TextInput
                  style={styles.contactInput}
                  value={editedProduct.whatsapp}
                  onChangeText={text => handleInputChange('whatsapp', text)}
                  placeholder="Número de WhatsApp"
                  keyboardType="phone-pad"
                  placeholderTextColor={COLORS.placeholder || '#999'}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductEdition;
