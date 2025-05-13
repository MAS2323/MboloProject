// components/menu/MenuItem.js
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles/MenuItem.styles';

const MenuItem = ({title, items}) => {
  return (
    <View style={styles.menuContainer}>
      <Text style={styles.menuTitle}>{title}</Text>
      {items.map((item, index) => (
        <TouchableOpacity key={index} style={styles.menuItem}>
          <Text style={styles.menuItemText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MenuItem;
