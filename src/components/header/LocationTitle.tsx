// components/header/LocationTitle.js
import React from 'react';
import {Text} from 'react-native';
import styles from './styles/Header.styles';

const LocationTitle = ({title = 'San Antonio de Palé'}) => {
  return <Text style={styles.locationTitle}>{title}</Text>;
};

export default LocationTitle;
