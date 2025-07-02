import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  SectionList,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {COLORS, ICONS} from '../../constants';
import {API_BASE_URL} from '../../config/Service.Config';
import {useNavigation} from '@react-navigation/native';
import SCREENS from '../../screens';
import styles from './styles/SettingsScreen';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  FontAwesome: require('react-native-vector-icons/FontAwesome').default,
  Ionicons: require('react-native-vector-icons/Ionicons').default,
  MaterialCommunityIcons:
    require('react-native-vector-icons/MaterialCommunityIcons').default,
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  AntDesign: require('react-native-vector-icons/AntDesign').default,
  FontAwesome6: require('react-native-vector-icons/FontAwesome6').default,
};

// Header Component

const Header = ({onBack, title}) => {
  const ChevronLeftIcon = IconComponents[ICONS.CHEVRON_LEFT.library];
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        {ChevronLeftIcon ? (
          <ChevronLeftIcon
            name={ICONS.CHEVRON_LEFT.name}
            size={ICONS.CHEVRON_LEFT.size}
            color={COLORS.black || '#000'}
          />
        ) : (
          <Text>←</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
      <View style={{width: 30}} />
    </View>
  );
};

// Menu Item Component
const MenuItem = ({
  icon,
  label,
  onPress,
  additionalInfo,
  iconColor,
  iconBackgroundColor,
}) => {
  const ChevronRightIcon = IconComponents[ICONS.CHEVRON_RIGHT.library];

  console.log('MenuItem icon:', icon, 'label:', label);
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuItemInner}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: iconBackgroundColor},
          ]}>
          {icon}
        </View>
        <Text style={styles.menuText}>{label}</Text>
      </View>
      <View style={styles.rightContainer}>
        {additionalInfo && (
          <Text style={styles.additionalInfo}>{additionalInfo}</Text>
        )}
        {ChevronRightIcon ? (
          <ChevronRightIcon
            name={ICONS.CHEVRON_RIGHT.name}
            size={ICONS.CHEVRON_RIGHT.size}
            color={COLORS.gray || '#666'}
          />
        ) : (
          <Text>→</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      if (!id) {
        navigation.navigate(SCREENS.LOGIN);
        return;
      }
      const userId = `user${JSON.parse(id)}`;
      const currentUser = await AsyncStorage.getItem(userId);
      if (currentUser) {
        setUserData(JSON.parse(currentUser));
        setIsLoggedIn(true);
      } else {
        navigation.navigate(SCREENS.LOGIN);
      }
    } catch (error) {
      setIsLoggedIn(false);
      console.error('Error al recuperar tus datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario.');
    }
  };

  const userLogout = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      if (!id) {
        console.log('El ID de usuario no está disponible');
        return;
      }
      const userId = `user${JSON.parse(id)}`;
      await AsyncStorage.multiRemove([userId, 'id']);
      navigation.replace(SCREENS.LOGIN);
      console.log('Sesión cerrada con éxito');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message || error);
      Alert.alert('Error', 'No se pudo cerrar la sesión.');
    }
  };

  const logout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'Continuar', onPress: userLogout},
      ],
    );
  };

  const deleteAccount = async () => {
    try {
      const userId = await AsyncStorage.getItem('id');
      if (!userId) {
        console.log('ID del usuario no encontrado en AsyncStorage');
        return;
      }
      Alert.alert(
        'Eliminar mi cuenta',
        '¿Estás seguro de que quieres eliminar tu cuenta permanentemente?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => console.log('Eliminación de cuenta cancelada'),
          },
          {
            text: 'Continuar',
            onPress: async () => {
              try {
                const endpoint = `${API_BASE_URL}/user/${JSON.parse(userId)}`;
                const response = await axios.delete(endpoint);
                if (response.status === 200) {
                  console.log('Cuenta eliminada');
                  await AsyncStorage.removeItem('id');
                  navigation.replace(SCREENS.LOGIN);
                  Alert.alert('Éxito', 'Tu cuenta ha sido eliminada.');
                }
              } catch (error) {
                console.error('Error al eliminar la cuenta:', error);
                Alert.alert(
                  'Error',
                  'No se pudo eliminar la cuenta. Intenta de nuevo.',
                );
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      Alert.alert('Error', 'No se pudo procesar la solicitud.');
    }
  };

  const clearCache = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();
      console.log('AsyncStorage limpiado correctamente.');

      // Reset navigation to the initial screen to refresh app state
      navigation.reset({
        index: 0,
        routes: [{name: SCREENS.TABS}],
      });

      Alert.alert('Éxito', 'El caché ha sido limpiado correctamente.');
    } catch (error) {
      console.error('Error al limpiar el caché:', error);
      Alert.alert('Error', 'No se pudo limpiar el caché. Intenta de nuevo.');
    }
  };

  // Definir iconos para sections usando la misma técnica
  const PersonIcon = IconComponents[ICONS.USER_O.library];
  const BusinessIcon = IconComponents[ICONS.BUSINESS.library];
  const PhoneIcon = IconComponents[ICONS.PHONE.library];
  const EmailSettingsIcon = IconComponents[ICONS.EMAIL_SETTINGS.library];
  const LockSettingsIcon = IconComponents[ICONS.LOCK_SETTINGS.library];
  const FeedbackIcon = IconComponents[ICONS.FEEDBACK.library];
  const NotificationsSettingsIcon =
    IconComponents[ICONS.NOTIFICATIONS_SETTINGS.library];
  const InfoIcon = IconComponents[ICONS.INFO.library];
  const CachedIcon = IconComponents[ICONS.CACHED.library];
  const DeleteIcon = IconComponents[ICONS.DELETE.library];
  const LogoutSettingsIcon = IconComponents[ICONS.LOGOUT_SETTINGS.library];

  const sections = [
    {
      title: 'Cuenta',
      data: [
        {
          icon: PersonIcon ? (
            <PersonIcon
              name={ICONS.USER_O.name}
              size={ICONS.USER_O.size}
              color={COLORS.white || '#fff'}
            />
          ) : null,
          label: 'Información personal',
          onPress: () => navigation.navigate(SCREENS.PERSONAL_INFO),
          iconColor: COLORS.white,
          iconBackgroundColor: COLORS.orange || '#FF9500',
        },
        {
          icon: BusinessIcon ? (
            <BusinessIcon
              name={ICONS.BUSINESS.name}
              size={ICONS.BUSINESS.size}
              color={COLORS.white || '#fff'}
            />
          ) : null,
          label: 'Información de negocio',
          onPress: () => navigation.navigate(SCREENS.COMPANY_DETAILS),
          iconColor: COLORS.white,
          iconBackgroundColor: COLORS.orange || '#FF9500',
        },
        {
          icon: PhoneIcon ? (
            <PhoneIcon
              name={ICONS.PHONE.name}
              size={ICONS.PHONE.size}
              color={COLORS.white || '#fff'}
            />
          ) : null,
          label: 'Teléfono',
          onPress: () => navigation.navigate(SCREENS.PHONE_NUMBERS),
          additionalInfo: 'Añadir',
          iconColor: COLORS.white,
          iconBackgroundColor: COLORS.green || '#00C853',
        },
        {
          icon: EmailSettingsIcon ? (
            <EmailSettingsIcon
              name={ICONS.EMAIL_SETTINGS.name}
              size={ICONS.EMAIL_SETTINGS.size}
              color={COLORS.white || '#fff'}
            />
          ) : null,
          label: 'Correo',
          onPress: () => navigation.navigate(SCREENS.CHANGE_EMAIL),
          additionalInfo: userData?.email || 'mboloapp@mbolo.com',
          iconColor: COLORS.white,
          iconBackgroundColor: COLORS.orange || '#FF9500',
        },
        {
          icon: LockSettingsIcon ? (
            <LockSettingsIcon
              name={ICONS.LOCK_SETTINGS.name}
              size={ICONS.LOCK_SETTINGS.size}
              color={COLORS.gray || '#666'}
            />
          ) : null,
          label: 'Cambiar contraseña',
          onPress: () => navigation.navigate(SCREENS.CHANGE_PASSWORD),
          iconColor: COLORS.gray,
          iconBackgroundColor: COLORS.lightGray || '#E0E0E0',
        },
      ],
    },
    {
      title: 'Preferencias',
      data: [
        {
          icon: FeedbackIcon ? (
            <FeedbackIcon
              name={ICONS.FEEDBACK.name}
              size={ICONS.FEEDBACK.size}
              color={COLORS.white || '#fff'}
            />
          ) : null,
          label: 'Desactivar comentarios',
          onPress: () => navigation.navigate(SCREENS.DISABLE_FEEDBACK),
          additionalInfo: 'Habilitado',
          iconColor: COLORS.white,
          iconBackgroundColor: COLORS.orange || '#FF9500',
        },
        {
          icon: NotificationsSettingsIcon ? (
            <NotificationsSettingsIcon
              name={ICONS.NOTIFICATIONS_SETTINGS.name}
              size={ICONS.NOTIFICATIONS_SETTINGS.size}
              color={COLORS.white || '#fff'}
            />
          ) : null,
          label: 'Gestionar notificaciones',
          onPress: () => navigation.navigate(SCREENS.MANAGE_NOTIFICATIONS),
          iconColor: COLORS.white,
          iconBackgroundColor: COLORS.darkRed || '#FF3D00',
        },
      ],
    },
    {
      title: 'General',
      data: [
        {
          icon: InfoIcon ? (
            <InfoIcon
              name={ICONS.INFO.name}
              size={ICONS.INFO.size}
              color={COLORS.white || '#fff'}
            />
          ) : null,
          label: 'Sobre MboloApp',
          onPress: () => navigation.navigate(SCREENS.SOBRE_NOSOTROS),
          iconColor: COLORS.white,
          iconBackgroundColor: COLORS.darkGray || '#212121',
        },
        {
          icon: CachedIcon ? (
            <CachedIcon
              name={ICONS.CACHED.name}
              size={ICONS.CACHED.size}
              color={COLORS.gray || '#666'}
            />
          ) : null,
          label: 'Limpiar caché',
          onPress: clearCache,
          iconColor: COLORS.gray,
          iconBackgroundColor: COLORS.lightGray || '#E0E0E0',
        },
        {
          icon: DeleteIcon ? (
            <DeleteIcon
              name={ICONS.DELETE.name}
              size={ICONS.DELETE.size}
              color={COLORS.gray || '#666'}
            />
          ) : null,
          label: 'Eliminar mi cuenta',
          onPress: deleteAccount,
          iconColor: COLORS.gray,
          iconBackgroundColor: COLORS.lightGray || '#E0E0E0',
        },
        {
          icon: LogoutSettingsIcon ? (
            <LogoutSettingsIcon
              name={ICONS.LOGOUT_SETTINGS.name}
              size={ICONS.LOGOUT_SETTINGS.size}
              color={COLORS.gray || '#666'}
            />
          ) : null,
          label: 'Cerrar sesión',
          onPress: logout,
          iconColor: COLORS.gray,
          iconBackgroundColor: COLORS.lightGray || '#E0E0E0',
        },
      ],
    },
  ];

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginPromptText}>
            Por favor, inicia sesión para continuar
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.LOGIN)}
            style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>INICIAR SESIÓN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.primary || '#4c86A8'} // Match the header gradient start color
        barStyle="light-content" // Changed to light-content for white icons/text on dark background
      />
      <Header onBack={() => navigation.goBack()} title="Configuración" />
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.label + index}
        renderItem={({item}) => {
          console.log('Rendering item:', item.label);
          return (
            <MenuItem
              icon={item.icon}
              label={item.label}
              onPress={item.onPress}
              additionalInfo={item.additionalInfo}
              iconColor={item.iconColor}
              iconBackgroundColor={item.iconBackgroundColor}
            />
          );
        }}
        renderSectionHeader={({section: {title}}) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.sectionListContent}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;
