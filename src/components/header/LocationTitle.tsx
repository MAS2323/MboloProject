// components/header/LocationTitle.js
import {Text} from 'react-native';
import styles from './styles/Header.styles';

const LocationTitle = ({title = 'Guinea Ecuatorial'}) => {
  return <Text style={styles.locationTitle}>{title}</Text>;
};

export default LocationTitle;
