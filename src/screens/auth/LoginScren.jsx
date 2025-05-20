import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ICONS, COLORS} from '../../constants';
import {API_BASE_URL} from '../../config/Service.Config';
import {useNavigation} from '@react-navigation/native';
import styles from './style/LoginScreenStyle';
import SCREENS from '..';
// Icon components
const IconComponents = {
  FontAwesome: require('react-native-vector-icons/FontAwesome').default,
  Ionicons: require('react-native-vector-icons/Ionicons').default,
  MaterialCommunityIcons:
    require('react-native-vector-icons/MaterialCommunityIcons').default,
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [obsecureText, setObsecureText] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const UserIcon = IconComponents[ICONS.USER_O.library];
  const LockIcon = IconComponents[ICONS.LOCK.library];
  const EyeIcon =
    IconComponents[
      obsecureText ? ICONS.EYE_OUTLINE.library : ICONS.EYE_OFF_OUTLINE.library
    ];

  const handleLogin = async () => {
    if (!email) {
      Alert.alert(
        'Error',
        'El campo de correo electrónico no puede estar vacío.',
      );
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Introduzca un correo electrónico válido.');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'El campo de contraseña no puede estar vacío.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    const endpoint = `${API_BASE_URL}/login`;

    try {
      const response = await axios.post(endpoint, {email, password});
      if (response.status === 200) {
        const responseData = response.data;
        if (responseData && responseData._id) {
          await AsyncStorage.setItem(
            `user${responseData._id}`,
            JSON.stringify(responseData),
          );
          await AsyncStorage.setItem('id', JSON.stringify(responseData._id));
          navigation.navigate(SCREENS.HOME_STACK);
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Error de inicio de sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <View style={styles.container}>
          <View style={styles.mboloContainer}>
            <Text style={styles.mboloText}>MBOLO</Text>
          </View>
          <View style={styles.loginContainer}>
            <Text style={styles.text_header}>Login !!</Text>
          </View>
          <View style={styles.wrapper}>
            <View
              style={[
                styles.action,
                {
                  borderColor: email
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
                placeholder="Correo electrónico"
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View
              style={[
                styles.action,
                {
                  borderColor: password
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
                value={password}
                onChangeText={setPassword}
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.white || '#fff'}
                  />
                ) : (
                  <Text style={styles.buttonText}>L O G I N</Text>
                )}
              </TouchableOpacity>
            </View>
            <Text
              style={styles.registration}
              onPress={() => navigation.navigate(SCREENS.REGISTER)}>
              ¿No tiene una cuenta? Regístrate
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
