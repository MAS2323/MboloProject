import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {fetchMenuCategories} from './api/menuApi';
import MenuItem from './MenuItem';
import styles from './styles/MenuScreen.styles';

const MenuScreen = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {width} = useWindowDimensions();

  // Use 3 columns for all screen sizes to match the image
  const numColumns = 3;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchMenuCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('No se pudieron cargar las categorías. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={styles.loader.color} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CATEGORÍAS</Text>

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
          key={numColumns} // Ensure FlatList re-renders when numColumns changes
        />
      )}
    </View>
  );
};

export default MenuScreen;
