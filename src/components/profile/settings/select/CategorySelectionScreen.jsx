import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {API_BASE_URL} from '../../../../config/Service.Config';
import {ICONS, COLORS} from '../../../../constants';
import SCREENS from '../../../../screens';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};

const CategorySelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {returnScreen} = route.params || {};
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Definir los íconos dinámicamente desde las constantes
  const BackIcon = IconComponents[ICONS.BACK.library || 'MaterialIcons'];
  const ChevronRightIcon =
    IconComponents[ICONS.CHEVRON_RIGHT.library || 'MaterialIcons'];

  // Cargar categorías de tipo "menu"
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/categories?type=product`,
        );
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'No se pudieron cargar las categorías.');
      }
    };

    fetchCategories();
  }, []);

  // Manejar parámetros recibidos
  useEffect(() => {
    const {selectedCategory} = route.params || {};
    if (selectedCategory) {
      try {
        const parsedCategory =
          typeof selectedCategory === 'string'
            ? JSON.parse(selectedCategory)
            : selectedCategory;
        setSelectedCategory(parsedCategory);
        fetchSubcategories(parsedCategory._id);
      } catch (error) {
        console.error('Error parsing selected category:', error);
      }
    }
  }, [route.params]);

  // Cargar subcategorías cuando se selecciona una categoría
  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory._id);
    }
  }, [selectedCategory]);

  const fetchSubcategories = async categoryId => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subcategories/category/${categoryId}`,
      );
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      Alert.alert('Error', 'No se pudieron cargar las subcategorías.');
    }
  };

  const handleCategorySelect = category => {
    setSelectedCategory(category);
    setSubcategories([]);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryPress = subcategory => {
    setSelectedSubcategory(subcategory);
    navigation.navigate(returnScreen || SCREENS.ADD_SCREENS, {
      categoryId: selectedCategory._id,
      categoryName: selectedCategory.name,
      subcategoryId: subcategory._id,
      subcategoryName: subcategory.name,
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate(returnScreen)}>
          <BackIcon
            name={ICONS.BACK.name || 'chevron-left'}
            size={ICONS.BACK.size || 30}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Selecciona una Categoría</Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={categories}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleCategorySelect(item)}>
              <View
                style={[
                  styles.item,
                  selectedCategory?._id === item._id && styles.selectedItem,
                ]}>
                <Text style={styles.text}>{item.name}</Text>
                <ChevronRightIcon
                  name={ICONS.CHEVRON_RIGHT.name || 'chevron-right'}
                  size={ICONS.CHEVRON_RIGHT.size || 24}
                  color={COLORS.secondary}
                />
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />

        {selectedCategory && (
          <>
            <Text style={styles.sectionTitle}>
              Subcategorías de {selectedCategory.name}
            </Text>
            {subcategories.length > 0 ? (
              <FlatList
                data={subcategories}
                keyExtractor={item => item._id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => handleSubcategoryPress(item)}>
                    <View
                      style={[
                        styles.item,
                        selectedSubcategory?._id === item._id &&
                          styles.selectedItem,
                      ]}>
                      <Text style={styles.text}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <Text style={styles.noData}>
                No hay subcategorías disponibles
              </Text>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    zIndex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.BLACK,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.DISABLED,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedItem: {
    backgroundColor: '#E3F2FD',
  },
  text: {
    fontSize: 16,
    color: COLORS.BLACK,
    fontWeight: '400',
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: COLORS.SECONDARY,
    fontStyle: 'italic',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
});

export default CategorySelectionScreen;
