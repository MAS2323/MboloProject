import {Text, View, FlatList, Image, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from './styles/CategoryMenuScreenStyle';
import SCREENS from '../../../screens';

const CategoryMenuScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {categoryName, subcategories, id: categoryId} = route.params || {};
  const parsedSubcategories = subcategories ? JSON.parse(subcategories) : [];

  return (
    <View style={styles.container}>
      {/* AppBarWrapper como header */}
      <View style={styles.appBarWrapper}>
        <Text style={styles.title}>{categoryName || 'Categoría'}</Text>
      </View>

      {/* Lista de subcategorías */}
      {parsedSubcategories.length > 0 ? (
        <FlatList
          data={parsedSubcategories}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate(SCREENS.SUB_CATEGORY_MENU_SCREEN, {
                  id: item._id,
                  subcategoryName: item.name,
                  subcategoryDescription: item.description,
                })
              }>
              <Image
                source={{
                  uri: item.imageUrl || 'https://via.placeholder.com/50',
                }}
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.text}>{item.name}</Text>
                {item.description && (
                  <Text style={styles.description}>{item.description}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.flatListContent}
          style={styles.flatList}
        />
      ) : (
        <Text style={styles.noData}>No hay subcategorías disponibles</Text>
      )}
    </View>
  );
};

export default CategoryMenuScreen;
