import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import LocationTitle from './LocationTitle';
import styles from './styles/Header.styles';
import {COLORS, ICONS} from '../../constants';
import SCREENS from '../../screens';
import {useNavigation} from '@react-navigation/native';
// Importar los componentes de iconos dinámicamente
const IconComponents = {
  Entypo: require('react-native-vector-icons/Entypo').default,
  SimpleLineIcons: require('react-native-vector-icons/SimpleLineIcons').default,
};

const Header = props => {
  const LocationIcon = IconComponents[ICONS.LOCATION.library];
  const StoreIcon = IconComponents[ICONS.BAG.library];
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.iconButton}>
          {LocationIcon && (
            <LocationIcon
              name={ICONS.LOCATION.name}
              size={ICONS.LOCATION.size}
              style={styles.icon}
            />
          )}
        </TouchableOpacity>

        <LocationTitle />

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate(SCREENS.CART)}>
          {StoreIcon && (
            <StoreIcon
              name={ICONS.BAG.name}
              size={ICONS.BAG.size}
              style={styles.icon}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
