import React, {ReactNode} from 'react';
import {View, Text} from 'react-native';
import styles from './styles/MenuSection.styles';

const MenuSection = ({title, children}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default MenuSection;
