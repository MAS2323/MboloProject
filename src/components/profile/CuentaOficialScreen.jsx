import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView, // Using SafeAreaView from react-native
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '../../config/Service.Config';
import styles from './styles/CuentaOficialScreenStyle';
import {COLORS} from '../../constants';

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
          Alert.alert(
            'Error',
            'Debes iniciar sesión para ver tu cuenta profesional.',
          );
          navigation.navigate('Login'); // Updated to use navigate
          return;
        }
        const cleanUserId = userId.replace(/"/g, '');

        // Llamada a la API para obtener la cuenta profesional del usuario
        const response = await axios.get(
          `${API_BASE_URL}/professional/owner/${cleanUserId}`,
        );

        // La API devuelve un objeto profesional o null si no existe
        const professional = response.data.professional;
        setCuentasOficiales(professional ? [professional] : []);
      } catch (err) {
        console.error('Error al cargar cuenta profesional:', err.message);
        setError('No se pudo cargar la cuenta profesional. Intenta de nuevo.');
        setCuentasOficiales([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCuentaProfesional();
  }, []);

  // Componente para renderizar la cuenta profesional
  const renderCuentaOficial = ({item}) => (
    <View style={styles.cuentaCard}>
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
          {item.description}
        </Text>
      </View>
    </View>
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
        {/* No mostramos el botón de "Agregar" si ya existe una cuenta */}
        {cuentasOficiales.length === 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('CrearCuentaOficialScreen')} // Updated to use navigate
          >
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de cuentas profesionales */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
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
            onPress={() => navigation.navigate('CrearCuentaOficialScreen')} // Updated to use navigate
          >
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
