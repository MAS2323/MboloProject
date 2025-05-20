import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, ICONS} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import SCREENS from '../index';
import styles from './styles/ProfileScreenStyle';
import IMAGES from '../../assets/images';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [numColumns, setNumColumns] = useState(2);

  useEffect(() => {
    checkExistingUser();
  }, []);

  useEffect(() => {
    const updateColumns = () => {
      const screenWidth = Dimensions.get('window').width;
      const minItemWidth = 150;
      const calculatedColumns = Math.floor(screenWidth / minItemWidth);
      setNumColumns(Math.max(1, calculatedColumns));
    };

    updateColumns();
    const subscription = Dimensions.addEventListener('change', updateColumns);
    return () => subscription?.remove();
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
      navigation.reset({
        index: 0,
        routes: [{name: SCREENS.LOGIN}],
      });
      console.log('Sesión cerrada con éxito');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message || error);
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

  const renderMenuItem = (icon, label, onPress) => (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuItemInner}>
        {icon}
        <Text style={styles.menuText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  const menuItems = [
    {
      icon: (
        <ICONS.BAG.Component
          name={ICONS.BAG.name}
          size={ICONS.BAG.size}
          color={COLORS.black}
        />
      ),
      label: 'Carrito',
      onPress: () => {
        if (!SCREENS.CART) {
          console.error('SCREENS.CART is undefined');
          Alert.alert('Error', 'CartScreen is not defined');
          return;
        }
        navigation.navigate(SCREENS.CART);
      },
    },
    {
      icon: (
        <ICONS.NOTIFICATIONS.Component
          name={ICONS.NOTIFICATIONS.name}
          size={ICONS.NOTIFICATIONS.size}
          color={COLORS.black}
        />
      ),
      label: 'Notificaciones',
      onPress: () => {
        if (!SCREENS.NOTIFICACIONES) {
          console.error('SCREENS.NOTIFICACIONES is undefined');
          Alert.alert('Error', 'NotificacionesScreen is not defined');
          return;
        }
        navigation.navigate(SCREENS.NOTIFICACIONES);
      },
    },
    {
      icon: (
        <ICONS.ACCOUNT.Component
          name={ICONS.ACCOUNT.name}
          size={ICONS.ACCOUNT.size}
          color={COLORS.black}
        />
      ),
      label: 'Cuenta Oficial',
      onPress: () => {
        if (!SCREENS.CUENTA_OFICIAL) {
          console.error('SCREENS.CUENTA_OFICIAL is undefined');
          Alert.alert('Error', 'CuentaOficialScreen is not defined');
          return;
        }
        navigation.navigate(SCREENS.CUENTA_OFICIAL);
      },
    },
    {
      icon: (
        <ICONS.STORE.Component
          name={ICONS.STORE.name}
          size={ICONS.STORE.size}
          color={COLORS.black}
        />
      ),
      label: 'Mi Tienda',
      onPress: () => {
        if (!SCREENS.MI_TIENDA) {
          console.error('SCREENS.MI_TIENDA is undefined');
          Alert.alert('Error', 'MiTiendaScreenAdmin is not defined');
          return;
        }
        navigation.navigate(SCREENS.MI_TIENDA);
      },
    },
    {
      icon: (
        <ICONS.ORDERS.Component
          name={ICONS.ORDERS.name}
          size={ICONS.ORDERS.size}
          color={COLORS.black}
        />
      ),
      label: 'Pedidos',
      onPress: () => {
        if (!SCREENS.MIS_PEDIDOS) {
          console.error('SCREENS.MIS_PEDIDOS is undefined');
          Alert.alert('Error', 'MisPedidosScreen is not defined');
          return;
        }
        navigation.navigate(SCREENS.MIS_PEDIDOS);
      },
    },
    {
      icon: (
        <ICONS.FOLLOWERS.Component
          name={ICONS.FOLLOWERS.name}
          size={ICONS.FOLLOWERS.size}
          color={COLORS.black}
        />
      ),
      label: 'Seguidores',
      onPress: () => {
        if (!SCREENS.SEGUIDORES) {
          console.error('SCREENS.SEGUIDORES is undefined');
          Alert.alert('Error', 'SeguidoresScreen is not defined');
          return;
        }
        navigation.navigate(SCREENS.SEGUIDORES);
      },
    },
    {
      icon: (
        <ICONS.SETTINGS.Component
          name={ICONS.SETTINGS.name}
          size={ICONS.SETTINGS.size}
          color={COLORS.black}
        />
      ),
      label: 'Configuración',
      onPress: () => {
        if (!SCREENS.SETTINGS) {
          console.error('SCREENS.SETTINGS is undefined');
          Alert.alert('Error', 'SettingsScreen is not defined');
          return;
        }
        navigation.navigate(SCREENS.SETTINGS);
      },
    },
    {
      icon: (
        <ICONS.LOGOUT.Component
          name={ICONS.LOGOUT.name}
          size={ICONS.LOGOUT.size}
          color={COLORS.red}
        />
      ),
      label: 'Cerrar Sesión',
      onPress: logout,
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
      <View style={[styles.header, {marginTop: 30}]}>
        <View style={styles.userContainer}>
          <Image
            style={styles.avatar}
            source={
              userData?.image?.url ? {uri: userData?.image?.url} : IMAGES.AVATAR
            }
            defaultSource={{uri: 'https://via.placeholder.com/40'}}
          />
          <Text style={styles.userNameText}>
            {userData?.userName || 'MAS ONEWE'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate(SCREENS.SETTINGS)}>
          <ICONS.SETTINGS.Component
            name={ICONS.SETTINGS.name}
            size={ICONS.SETTINGS.size}
            color={COLORS.black}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={isLoggedIn ? menuItems : []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) =>
          renderMenuItem(item.icon, item.label, item.onPress)
        }
        contentContainerStyle={styles.menuWrapper}
        numColumns={numColumns}
        key={numColumns}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
