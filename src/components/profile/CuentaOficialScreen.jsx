import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '../../config/Service.Config';
import styles from './styles/CuentaOficialScreenStyle';
import {COLORS} from '../../constants';
import SCREENS from '../../screens';

const CuentaOficialScreen = () => {
  const navigation = useNavigation();
  const [cuentasOficiales, setCuentasOficiales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar la cuenta profesional desde la API
  useEffect(() => {
    const loadCuentaProfesional = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Obtener userId desde AsyncStorage
        const userId = await AsyncStorage.getItem('id');
        if (!userId) {
          throw new Error(
            'Debes iniciar sesión para ver tu cuenta profesional.',
          );
        }
        const cleanUserId = userId.replace(/"/g, '');

        // Llamada a la API para obtener la cuenta profesional del usuario
        const response = await axios.get(
          `${API_BASE_URL}/professional/owner/${cleanUserId}`,
          {
            headers: {
              // Agrega el token de autenticación si es necesario
              // Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
            },
          },
        );

        // La API devuelve un objeto profesional o null si no existe
        const professional = response.data.professional || response.data;
        setCuentasOficiales(professional ? [professional] : []);
      } catch (err) {
        console.error('Error al cargar cuenta profesional:', err.message);
        setError(
          err.response?.status === 404
            ? 'No tienes una cuenta profesional aún.'
            : 'No se pudo cargar la cuenta profesional. Intenta de nuevo.',
        );
        setCuentasOficiales([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCuentaProfesional();
  }, []);

  // Componente para renderizar la cuenta profesional
  const renderCuentaOficial = ({item}) => (
    <TouchableOpacity
      style={styles.cuentaCard}
      onPress={() =>
        navigation.navigate({
          name: SCREENS.CREATE_PROFESIONAL_ACCOUNT,
          params: {professionalId: item._id},
        })
      }>
      {item.avatar?.url ? (
        <Image
          source={{uri: item.avatar.url}}
          style={styles.cuentaImage}
          onError={e =>
            console.error(
              'Error cargando imagen de la cuenta:',
              e.nativeEvent.error,
            )
          }
        />
      ) : (
        <View style={[styles.cuentaImage, styles.placeholderImage]}>
          <Ionicons name="business-outline" size={30} color={COLORS.gray} />
        </View>
      )}
      <View style={styles.cuentaInfo}>
        <Text style={styles.cuentaNombre}>{item.name}</Text>
        <Text style={styles.cuentaDescripcion} numberOfLines={2}>
          {item.description || 'Sin descripción disponible'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cuenta Profesional</Text>
        {cuentasOficiales.length === 0 && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate({name: SCREENS.CREATE_PROFESIONAL_ACCOUNT})
            }>
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de cuentas profesionales o mensaje de creación */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() =>
              navigation.navigate({name: SCREENS.CREATE_PROFESIONAL_ACCOUNT})
            }>
            <Text style={styles.createButtonText}>
              Crear Cuenta Profesional
            </Text>
          </TouchableOpacity>
        </View>
      ) : cuentasOficiales.length > 0 ? (
        <FlatList
          data={cuentasOficiales}
          renderItem={renderCuentaOficial}
          keyExtractor={item => item._id.toString()}
          contentContainerStyle={styles.cuentasList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No tienes una cuenta profesional aún.
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() =>
              navigation.navigate({name: SCREENS.CREATE_PROFESIONAL_ACCOUNT})
            }>
            <Text style={styles.createButtonText}>
              Crear Cuenta Profesional
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CuentaOficialScreen;
