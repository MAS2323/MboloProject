import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {API_BASE_URL} from '../../../config/Service.Config';
import styles from './styles/OfficialAccountProfileScreen';
import SCREENS from '../../../screens';

const OfficialAccountProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {accountId} = route.params || {};
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_BASE_URL}/accounts/${accountId}`,
        );
        setAccount(response.data);
      } catch (err) {
        setError('No se pudieron cargar los detalles de la cuenta.');
        console.error('Error fetching account details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchAccountDetails();
    }
  }, [accountId]);

  const handleViewProducts = () => {
    if (accountId) {
      navigation.navigate(SCREENS.OFFICIAL_ACCOUNT_PRODUCTS_SCREEN, {
        accountId,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loaderText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (error || !account) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'No se encontraron datos de la cuenta.'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{uri: account.logo || 'https://via.placeholder.com/100'}}
          style={styles.profilePicture}
          resizeMode="cover"
        />
        <Text style={styles.accountName}>
          {account.name || 'Cuenta Desconocida'}
        </Text>
        <Text style={styles.accountDescription}>
          {account.description || 'Sin descripción disponible.'}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Contacto</Text>
        <Text style={styles.contactInfo}>
          {account.contactInfo || 'Sin información de contacto'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.productsButton}
        onPress={handleViewProducts}>
        <Text style={styles.productsButtonText}>Ver Otros Productos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OfficialAccountProfileScreen;
