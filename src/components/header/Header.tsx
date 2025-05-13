// components/header/Header.js
import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LocationTitle from './LocationTitle';
import styles from './styles/Header.styles';
import ICONS from '../../constants/icons';

const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Feather
            name={ICONS.SEARCH.name}
            size={ICONS.SEARCH.size}
            style={styles.icon}
          />
        </TouchableOpacity>

        <LocationTitle />

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name={ICONS.CAMERA.name}
            size={ICONS.CAMERA.size}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
