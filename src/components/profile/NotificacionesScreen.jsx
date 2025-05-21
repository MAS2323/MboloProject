import {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../constants';
import {API_BASE_URL} from '../../config/Service.Config';
import styles from './styles/NotificacionesStyle';
// Header Component
const Header = ({onBack, title}) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack}>
      <MaterialIcons name="chevron-left" size={30} color="#00C853" />
    </TouchableOpacity>
    <Text style={styles.headerText}>{title}</Text>
    <View style={{width: 30}} />
  </View>
);

// Notification Item Component
const NotificationItem = ({message, type, read, timestamp, onMarkAsRead}) => {
  const getIconAndColor = () => {
    switch (type) {
      case 'message':
        return {icon: 'message', color: '#00C853'};
      case 'update':
        return {icon: 'update', color: '#FF9500'};
      case 'promotion':
        return {icon: 'local-offer', color: '#FF3D00'};
      default:
        return {icon: 'notifications', color: '#757575'};
    }
  };

  const {icon, color} = getIconAndColor();
  const formattedDate = new Date(timestamp).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.notificationCard, !read && styles.unreadNotification]}>
      <View style={styles.notificationContent}>
        <View style={[styles.iconContainer, {backgroundColor: color}]}>
          <MaterialIcons name={icon} size={24} color={COLORS.white} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.messageText}>{message}</Text>
          <Text style={styles.timestampText}>{formattedDate}</Text>
        </View>
      </View>
      {!read && (
        <TouchableOpacity onPress={onMarkAsRead} style={styles.readButton}>
          <Text style={styles.readButtonText}>Marcar como leído</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NotificacionesScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation(); // Replaced useRouter with useNavigation

  // Fetch user ID and notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      if (!id) {
        Alert.alert(
          'Error',
          'No se encontró el usuario. Por favor, inicia sesión nuevamente.',
        );
        navigation.navigate('LoginScreen');
        return;
      }
      const parsedId = JSON.parse(id);
      setUserId(parsedId);

      const response = await axios.get(
        `${API_BASE_URL}/notifications/${parsedId}`,
        {
          headers: {
            // Authorization: `Bearer ${await AsyncStorage.getItem("token")}`, // Uncomment if auth required
          },
        },
      );
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las notificaciones.');
      setLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark a notification as read
  const markAsRead = async notificationId => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            // Authorization: `Bearer ${await AsyncStorage.getItem("token")}`, // Uncomment if auth required
          },
        },
      );
      Alert.alert('Éxito', response.data.message);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? {...notif, read: true} : notif,
        ),
      );
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      Alert.alert('Error', 'No se pudo marcar la notificación como leída.');
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
      <Header onBack={() => navigation.goBack()} title="Notificaciones" />
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="notifications-none" size={50} color="#757575" />
          <Text style={styles.emptyText}>No tienes notificaciones</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <NotificationItem
              message={item.message}
              type={item.type}
              read={item.read}
              timestamp={item.createdAt}
              onMarkAsRead={() => markAsRead(item._id)}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificacionesScreen;
