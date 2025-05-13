// components/menu/MenuItem/MenuItem.js
import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import styles from './styles/MenuItem.styles';

const MenuItem = ({item, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {item.imageUrl && (
        <Image source={{uri: item.imageUrl}} style={styles.image} />
      )}

      <Text style={styles.title}>{item.name}</Text>

      <View style={styles.subcategoriesContainer}>
        {item.subcategories?.map((subcategory, index) => (
          <Text key={`sub-${index}`} style={styles.subcategoryText}>
            • {subcategory}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default MenuItem;
