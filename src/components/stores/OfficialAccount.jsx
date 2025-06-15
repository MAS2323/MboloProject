import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {API_BASE_URL} from '../../config/Service.Config';
import SCREENS from '../../screens';
import {COLORS, SIZES} from '../../constants';

const OfficialAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch official accounts
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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/categories?type=menu`,
        );
        setCategorias(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'No se pudieron cargar las categorías.');
      }
    };
    fetchCategories();
  }, []);

  // Handle category selection
  const handleCategorySelect = category => {
    setSelectedCategory(category);
    if (category) {
      navigation.navigate(SCREENS.PRODUCT_LIST_CATEGORY, {
        categoryId: category._id,
      });
    }
  };

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
      {/* Lista de Categorías (Horizontal) */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryListContainer}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              !selectedCategory && styles.selectedCategoryButton,
            ]}
            onPress={() => handleCategorySelect(null)}>
            <Text
              style={[
                styles.categoryText,
                !selectedCategory && styles.selectedCategoryText,
              ]}
              numberOfLines={1}>
              Todas
            </Text>
          </TouchableOpacity>
          {categorias.map(category => (
            <TouchableOpacity
              key={category._id}
              style={[
                styles.categoryButton,
                selectedCategory?._id === category._id &&
                  styles.selectedCategoryButton,
              ]}
              onPress={() => handleCategorySelect(category)}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory?._id === category._id &&
                    styles.selectedCategoryText,
                ]}
                numberOfLines={1}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de Cuentas Oficiales */}
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
  categoryContainer: {
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.small,
  },
  categoryListContainer: {
    paddingHorizontal: SIZES.small,
  },
  categoryButton: {
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.small,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    marginRight: SIZES.small,
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
  selectedCategoryText: {
    color: COLORS.white,
    fontWeight: 'bold',
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
