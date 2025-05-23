import {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import DateTimePicker from '@react-native-community/datetimepicker';
import {API_BASE_URL} from '../../../config/Service.Config';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {ICONS} from '../../../constants';
import IMAGES from '../../../assets/images';
import styles from './styles/PersonalInfoScreenStyle';
import SCREENS from '../../../screens';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  FontAwesome: require('react-native-vector-icons/FontAwesome').default,
  Fontisto: require('react-native-vector-icons/Fontisto').default,
  SimpleLineIcons: require('react-native-vector-icons/SimpleLineIcons').default,
};

// Componente para el header
const Header = ({onBack, title}) => {
  const ChevronLeftIcon = IconComponents[ICONS.CHEVRON_LEFT.library];

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <ChevronLeftIcon
          name={ICONS.CHEVRON_LEFT.name}
          size={ICONS.CHEVRON_LEFT.size}
          color="#00C853"
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
      <TouchableOpacity style={styles.savedButton} disabled>
        <Text style={styles.savedButtonText}>Guardado</Text>
      </TouchableOpacity>
    </View>
  );
};

// Componente para el avatar
const AvatarSection = ({image, onPickImage}) => {
  const CheckCircleIcon = IconComponents[ICONS.CHECK_CIRCLE.library];

  return (
    <View style={styles.avatarContainer}>
      <TouchableOpacity onPress={onPickImage}>
        <Image
          source={image ? {uri: image} : IMAGES.PLACEHOLDER}
          style={styles.image}
        />
        <View style={styles.editBadge}>
          <Text style={styles.editBadgeText}>EDITAR</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.approvedContainer}>
        <CheckCircleIcon
          name={ICONS.CHECK_CIRCLE.name}
          size={ICONS.CHECK_CIRCLE.size}
          color="#00C853"
        />
        <Text style={styles.approvedText}>aprobado</Text>
      </View>
    </View>
  );
};

// Componente para los campos de entrada
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  onPress,
  editable = true,
}) => {
  const ArrowDropDownIcon = IconComponents[ICONS.ARROW_DROP_DOWN.library];

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      {editable ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B0BEC5"
        />
      ) : (
        <TouchableOpacity style={styles.dropdown} onPress={onPress}>
          <Text style={styles.dropdownText}>{value || placeholder}</Text>
          <ArrowDropDownIcon
            name={ICONS.ARROW_DROP_DOWN.name}
            size={ICONS.ARROW_DROP_DOWN.size}
            color="#757575"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Componente para la sección de redes sociales
const SocialMediaSection = ({
  facebookConnected,
  setFacebookConnected,
  googleConnected,
  setGoogleConnected,
}) => {
  const WavingHandIcon = IconComponents[ICONS.WAVING_HAND.library];
  const FacebookIcon = IconComponents[ICONS.FACEBOOK.library];
  const GoogleIcon = IconComponents[ICONS.GOOGLE.library];

  return (
    <View style={styles.socialMediaSection}>
      <View style={styles.socialMediaMessage}>
        <WavingHandIcon
          name={ICONS.WAVING_HAND.name}
          size={ICONS.WAVING_HAND.size}
          color="#000"
        />
        <Text style={styles.socialMediaText}>
          ¡Conecta tus cuentas de redes sociales para una experiencia más
          fluida!
        </Text>
      </View>
      <View style={styles.socialMediaItem}>
        <FacebookIcon
          name={ICONS.FACEBOOK.name}
          size={ICONS.FACEBOOK.size}
          color="#3b5998"
        />
        <Text style={styles.socialMediaLabel}>Facebook</Text>
        <Switch
          value={facebookConnected}
          onValueChange={setFacebookConnected}
          trackColor={{false: '#767577', true: '#00C853'}}
          thumbColor={facebookConnected ? '#fff' : '#f4f3f4'}
        />
      </View>
      <View style={styles.socialMediaItem}>
        <GoogleIcon
          name={ICONS.GOOGLE.name}
          size={ICONS.GOOGLE.size}
          color="#DB4437"
        />
        <Text style={styles.socialMediaLabel}>Google</Text>
        <Switch
          value={googleConnected}
          onValueChange={setGoogleConnected}
          trackColor={{false: '#767577', true: '#00C853'}}
          thumbColor={googleConnected ? '#fff' : '#f4f3f4'}
        />
      </View>
    </View>
  );
};

const PersonalInfoScreen = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [birthday, setBirthday] = useState('');
  const [sex, setSex] = useState('No especificar');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFacebookConnected, setIsFacebookConnected] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();

  // Cargar datos desde AsyncStorage
  const loadUserData = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      if (!id) {
        Alert.alert(
          'Error',
          'No se encontró el usuario. Por favor, inicia sesión.',
        );
        navigation.navigate('LoginScreen');
        return;
      }
      const parsedId = JSON.parse(id);
      const userKey = `user${parsedId}`;
      const currentUser = await AsyncStorage.getItem(userKey);
      if (currentUser) {
        const parsedUserData = JSON.parse(currentUser);
        setUserData(parsedUserData);
        setUserId(parsedId);
        const fullName = parsedUserData.userName || '';
        const nameParts = fullName.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(
          parsedUserData.lastName || nameParts.slice(1).join(' ') || '',
        );
        setLocation(
          parsedUserData.ciudad?.name || parsedUserData.location || '',
        );
        setBirthday(parsedUserData.birthday || '');
        setSex(parsedUserData.sex || 'No especificar');
        setImage(parsedUserData.image?.url || '');
        setIsLoggedIn(true);
      } else {
        Alert.alert(
          'Error',
          'No se encontraron datos de usuario. Por favor, inicia sesión.',
        );
        navigation.navigate('LoginScreen');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setIsLoggedIn(false);
      setLoading(false);
      Alert.alert(
        'Error',
        'No se pudo cargar la información. Por favor, inicia sesión.',
      );
      navigation.navigate('LoginScreen');
    }
  }, [navigation]);

  // Cargar datos al montar y al volver a enfocar
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData]),
  );

  // Seleccionar imagen con permisos
  const pickImage = async () => {
    try {
      // Request permissions based on platform
      let permissionResult;
      if (Platform.OS === 'android') {
        permissionResult = await check(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
        if (permissionResult !== RESULTS.GRANTED) {
          permissionResult = await request(
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          );
        }
      } else if (Platform.OS === 'ios') {
        permissionResult = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (permissionResult !== RESULTS.GRANTED) {
          permissionResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        }
      }

      if (permissionResult !== RESULTS.GRANTED) {
        Alert.alert('Error', 'Se requiere permiso para acceder a la galería.');
        return;
      }

      const result = await launchImageLibrary({
        mediaType: 'photo',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.didCancel && result.assets) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  // Manejar cambio de fecha
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      try {
        const formattedDate = selectedDate.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        setBirthday(formattedDate);
      } catch (error) {
        console.error('Error formatting date:', error);
        Alert.alert('Error', 'No se pudo formatear la fecha.');
      }
    }
  };

  // Actualizar perfil
  const handleUpdateProfile = async () => {
    // Validaciones
    if (!firstName.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'El apellido es obligatorio');
      return;
    }
    if (birthday && !/^\d{2}\/\d{2}\/\d{4}$/.test(birthday)) {
      Alert.alert(
        'Error',
        'La fecha de nacimiento debe tener el formato DD/MM/YYYY',
      );
      return;
    }

    const formData = new FormData();
    formData.append('userName', firstName.trim());
    formData.append('lastName', lastName.trim());
    formData.append('location', location || '');
    formData.append('birthday', birthday || '');
    formData.append('sex', sex || 'No especificar');

    if (image && image.startsWith('file://')) {
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';
      formData.append('image', {uri: image, name: filename, type});
    }

    try {
      console.log('Enviando datos al backend:', {
        userName: firstName.trim(),
        lastName: lastName.trim(),
        location,
        birthday,
        sex,
      });
      const response = await axios.put(
        `${API_BASE_URL}/user/${userId}`,
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        },
      );
      console.log('Respuesta del backend:', response.data);

      const updatedUser = response.data.user;
      if (updatedUser) {
        setUserData(updatedUser);
        setFirstName(updatedUser.userName?.split(' ')[0] || '');
        setLastName(updatedUser.lastName || '');
        setLocation(updatedUser.ciudad?.name || updatedUser.location || '');
        setBirthday(updatedUser.birthday || '');
        setSex(updatedUser.sex || 'No especificar');
        setImage(updatedUser.image?.url || '');
        await AsyncStorage.setItem(
          `user${userId}`,
          JSON.stringify(updatedUser),
        );
      }

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error(
        'Error al actualizar el perfil:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        'No se pudo actualizar el perfil. Por favor, intenta de nuevo más tarde.',
      );
    }
  };

  // Renderizar estados de carga o no autenticado
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={() => navigation.goBack()} title="Detalles personales" />
      <KeyboardAvoidingView
        style={styles.scrollWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <AvatarSection image={image} onPickImage={pickImage} />
          <View style={styles.formContainer}>
            <InputField
              label="Nombre*"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Ingresa tu nombre"
            />
            <InputField
              label="Apellido*"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Ingresa tu apellido"
            />
            <InputField
              label="Ubicación"
              value={location || userData?.ciudad?.name}
              placeholder="Seleccionar ubicación"
              onPress={() => navigation.navigate(SCREENS.SELECT_CITY_SCREEN)}
              editable={false}
            />
            <InputField
              label="Fecha de nacimiento"
              value={birthday}
              placeholder="Selecciona tu fecha de nacimiento"
              onPress={() => setShowDatePicker(true)}
              editable={false}
            />
            {showDatePicker && (
              <DateTimePicker
                value={
                  birthday
                    ? new Date(birthday.split('/').reverse().join('-'))
                    : new Date()
                }
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
            <InputField
              label="Sexo"
              value={sex}
              placeholder="Seleccionar sexo"
              onPress={() => navigation.navigate(SCREENS.SELECT_SEX_SCREEN)}
              editable={false}
            />
            <SocialMediaSection
              facebookConnected={isFacebookConnected}
              setFacebookConnected={setIsFacebookConnected}
              googleConnected={isGoogleConnected}
              setGoogleConnected={setIsGoogleConnected}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateProfile}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PersonalInfoScreen;
