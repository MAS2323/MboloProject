import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ICONS, COLORS} from '../../constants';
import {API_BASE_URL} from '../../config/Service.Config';
import {useNavigation} from '@react-navigation/native';
import styles from './style/RegisterScreen';
import SCREENS from '..';

// Icon components
const IconComponents = {
  FontAwesome: require('react-native-vector-icons/FontAwesome').default,
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  MaterialCommunityIcons:
    require('react-native-vector-icons/MaterialCommunityIcons').default,
};

const RegisterScreen = () => {
  const [loading, setLoading] = useState(false);
  const [obsecureText, setObsecureText] = useState(true);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const UserIcon = IconComponents[ICONS.USER_O.library];
  const EmailIcon = IconComponents[ICONS.EMAIL.library];
  const LockIcon = IconComponents[ICONS.LOCK.library];
  const EyeIcon =
    IconComponents[
      obsecureText ? ICONS.EYE_OUTLINE.library : ICONS.EYE_OFF_OUTLINE.library
    ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName || formData.userName.length < 3) {
      newErrors.userName = 'El nombre debe tener al menos 3 caracteres.';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Introduce un email válido.';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerUser = async () => {
    if (!validateForm()) {
      Alert.alert('Formulario inválido', 'Por favor revisa los campos.');
      return;
    }
    setLoading(true);
    try {
      const endpoint = `${API_BASE_URL}/register`;
      const response = await axios.post(endpoint, formData);

      if (response.status === 200) {
        const userId = response.data.userId;
        const userData = {
          userName: formData.userName,
          email: formData.email,
        };
        await AsyncStorage.setItem('id', JSON.stringify(userId));
        await AsyncStorage.setItem(`user${userId}`, JSON.stringify(userData));
        navigation.navigate(SCREENS.HOME_STACK);
        Alert.alert(
          'Registro exitoso',
          'Has sido registrado e iniciado sesión automáticamente.',
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Error al registrarse, intenta de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({...formData, [name]: value});
    // Clear error for the field when user starts typing
    if (errors[name]) {
      setErrors({...errors, [name]: null});
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContainer}>
          <Text style={styles.textHeader}>Registrar</Text>
          <View style={styles.wrapper}>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: formData.userName
                    ? COLORS.primary || '#4c86A8'
                    : COLORS.offwhite || '#ccc',
                },
              ]}>
              <UserIcon
                name={ICONS.USER_O.name}
                size={ICONS.USER_O.size}
                color="#4c86A8"
                style={styles.smallIcon}
              />
              <TextInput
                placeholder="Usuario"
                style={styles.textInput}
                value={formData.userName}
                onChangeText={text => handleInputChange('userName', text)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.userName && (
              <Text style={styles.errorText}>{errors.userName}</Text>
            )}
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: formData.email
                    ? COLORS.primary || '#4c86A8'
                    : COLORS.offwhite || '#ccc',
                },
              ]}>
              <EmailIcon
                name={ICONS.EMAIL.name}
                size={ICONS.EMAIL.size}
                color="#4c86A8"
                style={styles.smallIcon}
              />
              <TextInput
                placeholder="Correo electrónico"
                style={styles.textInput}
                value={formData.email}
                onChangeText={text => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: formData.password
                    ? COLORS.primary || '#4c86A8'
                    : COLORS.offwhite || '#ccc',
                },
              ]}>
              <LockIcon
                name={ICONS.LOCK.name}
                size={ICONS.LOCK.size}
                color="#4c86A8"
                style={styles.smallIcon}
              />
              <TextInput
                secureTextEntry={obsecureText}
                placeholder="Contraseña"
                style={styles.textInput}
                value={formData.password}
                onChangeText={text => handleInputChange('password', text)}
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setObsecureText(!obsecureText)}>
                <EyeIcon
                  name={
                    obsecureText
                      ? ICONS.EYE_OUTLINE.name
                      : ICONS.EYE_OFF_OUTLINE.name
                  }
                  size={
                    obsecureText
                      ? ICONS.EYE_OUTLINE.size
                      : ICONS.EYE_OFF_OUTLINE.size
                  }
                  color="#4c86A8"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={registerUser}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.white || '#fff'}
                  />
                ) : (
                  <Text style={styles.buttonText}>REGISTRAR</Text>
                )}
              </TouchableOpacity>
            </View>
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate(SCREENS.LOGIN)}>
              ¿Ya tienes una cuenta? Inicia sesión
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
