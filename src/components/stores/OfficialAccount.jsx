import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {API_BASE_URL} from '../../config/Service.Config';
import SCREENS from '../../screens';
import {COLORS} from '../../constants';

const OfficialAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOfficialAccounts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/menus`);
        const data = response.data;
        if (response.status !== 200) {
          throw new Error(data.message || 'Error fetching official accounts');
        }
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching official accounts:', error.message);
        Alert.alert('Error', 'No se pudieron cargar las cuentas oficiales');
      } finally {
        setLoading(false);
      }
    };
    fetchOfficialAccounts();
  }, []);

  const renderAccountItem = ({item}) => (
    <TouchableOpacity
      style={styles.accountItem}
      onPress={() =>
        navigation.navigate(SCREENS.OFFICIAL_ACCOUNT_DETAIL, {id: item._id})
      }>
      <Image
        source={{uri: item.images[0]?.url || 'https://via.placeholder.com/150'}}
        style={styles.accountImage}
        resizeMode="cover"
      />
      <View style={styles.accountInfo}>
        <Text style={styles.accountName} numberOfLines={1}>
          {item.name || 'Sin nombre'}
        </Text>
        <Text style={styles.accountDescription} numberOfLines={2}>
          {item.description || 'Sin descripción'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c86A8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        renderItem={renderAccountItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay cuentas oficiales disponibles
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default OfficialAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  listContainer: {
    padding: 10,
  },
  accountItem: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  accountImage: {
    width: '100%',
    height: 150,
  },
  accountInfo: {
    padding: 10,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  accountDescription: {
    fontSize: 14,
    color: '#ccc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
});
