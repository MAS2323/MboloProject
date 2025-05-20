import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  SafeAreaView, // Added SafeAreaView from react-native
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import styles from './styles/CrearTiendaScreenStyle';
const CrearTiendaScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone_number: '',
    address: '',
    owner: '', // En una app real, esto vendría del usuario autenticado
  });
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const pickImage = async type => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      allowsEditing: true,
      aspectRatio: type === 'logo' ? [1, 1] : [4, 1],
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'No se pudo seleccionar la imagen.');
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (type === 'logo') {
          setLogo(uri);
        } else {
          setBanner(uri);
        }
      }
    });
  };

  const handleSubmit = async () => {
    // Validación de campos
    const missingFields = [];
    if (!formData.name) missingFields.push('Nombre');
    if (!formData.description) missingFields.push('Descripción');
    if (!formData.phone_number) missingFields.push('Teléfono');
    if (!formData.address) missingFields.push('Dirección');
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
      // Aquí iría la llamada a tu API para crear la tienda
      // Ejemplo con FormData para enviar datos e imágenes
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('owner', formData.owner);
      if (logo) {
        formDataToSend.append('logo', {
          uri: logo,
          name: 'logo.jpg',
          type: 'image/jpeg',
        });
      }
      if (banner) {
        formDataToSend.append('banner', {
          uri: banner,
          name: 'banner.jpg',
          type: 'image/jpeg',
        });
      }

      // Descomentar y ajustar según tu API
      // const response = await fetch('tu-api/tiendas', {
      //   method: 'POST',
      //   body: formDataToSend,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // const result = await response.json();

      // Simulación de éxito
      Alert.alert('Éxito', 'Tienda creada correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error al crear tienda:', error);
      Alert.alert('Error', 'No se pudo crear la tienda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear Nueva Tienda</Text>

        {/* Campo Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de la tienda*</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={text => handleChange('name', text)}
            placeholder="Ej: GD Tienda"
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
            placeholder="Ej: +123456789"
            keyboardType="phone-pad"
          />
        </View>

        {/* Campo Dirección */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección*</Text>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={text => handleChange('address', text)}
            placeholder="Dirección física o ID de ubicación"
          />
        </View>

        {/* Subir Logo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Logo de la tienda*</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage('logo')}>
            {logo ? (
              <Image source={{uri: logo}} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imagePickerText}>Seleccionar Logo (1:1)</Text>
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
              <Image
                source={{uri: banner}}
                style={[styles.imagePreview, styles.bannerPreview]}
              />
            ) : (
              <Text style={styles.imagePickerText}>
                Seleccionar Banner (4:1)
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Botón de enviar */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.submitButtonText}>
            {loading ? 'Creando...' : 'Crear Tienda'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CrearTiendaScreen;
