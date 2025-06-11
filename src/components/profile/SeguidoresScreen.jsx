import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView, // Using SafeAreaView from react-native
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles/SeguidoresStyle';
import {COLORS} from '../../constants';

const SeguidoresScreen = () => {
  const navigation = useNavigation(); // Replaced useRouter with useNavigation
  const [seguidores, setSeguidores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Datos de prueba para los seguidores (sin cambios)
  const datosPruebaSeguidores = [
    {
      id: '1',
      userName: 'Ana García',
      profilePicture: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Ana',
    },
    {
      id: '2',
      userName: 'Carlos Pérez',
      profilePicture:
        'https://via.placeholder.com/150/33FF57/FFFFFF?text=Carlos',
    },
    {
      id: '3',
      userName: 'María López',
      profilePicture:
        'https://via.placeholder.com/150/5733FF/FFFFFF?text=María',
    },
    {
      id: '4',
      userName: 'Juan Rodríguez',
      profilePicture: 'https://via.placeholder.com/150/FFFF33/FFFFFF?text=Juan',
    },
    {
      id: '5',
      userName: 'Sofía Martínez',
      profilePicture:
        'https://via.placeholder.com/150/33FFFF/FFFFFF?text=Sofía',
    },
  ];

  // Cargar los datos de prueba (sin cambios)
  useEffect(() => {
    const loadSeguidores = async () => {
      try {
        setIsLoading(true);
        // Simular una carga de datos
        setTimeout(() => {
          setSeguidores(datosPruebaSeguidores);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error al cargar datos de prueba:', err.message);
        setSeguidores([]);
        setIsLoading(false);
      }
    };

    loadSeguidores();
  }, []);

  // Componente para renderizar cada seguidor (sin cambios)
  const renderSeguidor = ({item}) => (
    <View style={styles.seguidorCard}>
      {item.profilePicture ? (
        <Image
          source={{uri: item.profilePicture}}
          style={styles.seguidorImage}
          onError={e =>
            console.error(
              'Error cargando imagen del seguidor:',
              e.nativeEvent.error,
            )
          }
        />
      ) : (
        <View style={[styles.seguidorImage, styles.placeholderImage]}>
          <Ionicons name="person-outline" size={30} color={COLORS.gray} />
        </View>
      )}
      <Text style={styles.seguidorName}>{item.userName}</Text>
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
          <MaterialIcons name="chevron-left" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seguidores</Text>
        <View style={{width: 24}} /> {/* Espacio para mantener simetría */}
      </View>

      {/* Lista de seguidores */}
      {seguidores.length > 0 ? (
        <FlatList
          data={seguidores}
          renderItem={renderSeguidor}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.seguidoresList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes seguidores aún.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SeguidoresScreen;
