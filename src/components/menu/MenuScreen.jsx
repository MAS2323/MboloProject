import {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import MenuItem from './MenuItem';
import MenuSection from './MenuSection';
import styles from './styles/MenuScreen.styles';
import SCREENS from '../../screens';
import {API_BASE_URL} from '../../config/Service.Config';

const MenuScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  const numColumns = 3;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/categories?type=menu`,
        );
        setCategories(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('No se pudieron cargar las categorías. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryPress = async (categoryId, categoryName) => {
    console.log('Category ID sent from frontend:', categoryId);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subcategories/category/${categoryId}`,
      );
      navigation.navigate(SCREENS.CATEGORY_MENU_SCREEN, {
        id: categoryId,
        categoryName,
        subcategories: JSON.stringify(response.data || []),
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        navigation.navigate(SCREENS.CATEGORY_MENU_SCREEN, {
          id: categoryId,
          categoryName,
          subcategories: JSON.stringify([]),
        });
      } else {
        console.error('Error fetching subcategories:', error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={styles.loader.color} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MenuSection title="CATEGORÍAS">
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={categories}
            renderItem={({item}) => (
              <MenuItem
                item={item}
                onPress={() => handleCategoryPress(item._id, item.name)}
              />
            )}
            keyExtractor={item => item._id}
            numColumns={numColumns}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.columnWrapper}
            key={numColumns}
          />
        )}
      </MenuSection>
    </View>
  );
};

export default MenuScreen;
