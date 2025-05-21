import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {API_BASE_URL} from '../../config/Service.Config';
import {COLORS, ICONS} from '../../../constants';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};

// Header Component
const Header = ({onBack, title}) => {
  const ChevronLeftIcon = IconComponents[ICONS.CHEVRON_LEFT.library];

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <ChevronLeftIcon
          name={ICONS.CHEVRON_LEFT.name}
          size={ICONS.CHEVRON_LEFT.size}
          color={COLORS.green}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
      <View style={{width: 30}} />
    </View>
  );
};

// Notification Toggle Component
const NotificationToggle = ({label, value, onValueChange}) => (
  <View style={styles.toggleContainer}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{false: COLORS.gray, true: COLORS.green}}
      thumbColor={value ? COLORS.white : COLORS.thumbGray}
    />
  </View>
);

const ManageNotificationsScreen = () => {
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState({
    messages: true,
    updates: true,
    promotions: false,
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Load user ID and notification preferences
  const loadUserData = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      if (!id) {
        Alert.alert(
          'Error',
          'No se encontró el usuario. Por favor, inicia sesión nuevamente.',
        );
        navigation.navigate('Login');
        return;
      }
      const parsedId = JSON.parse(id);
      setUserId(parsedId);

      // Fetch notification preferences
      const response = await axios.get(`${API_BASE_URL}/user/${parsedId}`, {
        headers: {
          // Authorization: `Bearer ${await AsyncStorage.getItem("token")}`, // Uncomment if auth required
        },
      });
      if (response.data.notifications) {
        setNotifications(response.data.notifications);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar preferencias de notificaciones:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar las preferencias de notificaciones.',
      );
      setLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Update notification preferences
  const handleSaveNotifications = async () => {
    if (!userId) {
      Alert.alert('Error', 'No se encontró el usuario.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/user/${userId}/notifications`,
        notifications,
        {
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${await AsyncStorage.getItem("token")}`, // Uncomment if auth required
          },
        },
      );
      Alert.alert('Éxito', response.data.message);
      navigation.goBack();
    } catch (error) {
      console.error(
        'Error al guardar notificaciones:',
        error.response?.data || error.message,
      );
      const message =
        error.response?.data?.message ||
        'No se pudieron guardar las preferencias de notificaciones.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onBack={() => navigation.goBack()}
        title="Gestionar Notificaciones"
      />
      <View style={styles.content}>
        <NotificationToggle
          label="Mensajes"
          value={notifications.messages}
          onValueChange={value =>
            setNotifications({...notifications, messages: value})
          }
        />
        <NotificationToggle
          label="Actualizaciones de la aplicación"
          value={notifications.updates}
          onValueChange={value =>
            setNotifications({...notifications, updates: value})
          }
        />
        <NotificationToggle
          label="Promociones y ofertas"
          value={notifications.promotions}
          onValueChange={value =>
            setNotifications({...notifications, promotions: value})
          }
        />
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSaveNotifications}
          disabled={loading}>
          <Text style={styles.saveButtonText}>
            {loading ? 'Cargando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ManageNotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: COLORS.green,
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: COLORS.lightGreen,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
