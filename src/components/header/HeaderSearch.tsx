// components/header/HeaderSearch.js
import React from 'react';
import {View, TextInput, Text, TouchableOpacity} from 'react-native';
import styles from './styles/HeaderSearch.styles';
import {COLORS, ICONS} from '../../constants';
import SCREENS from '../../screens';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  Feather: require('react-native-vector-icons/Feather').default,
  Ionicons: require('react-native-vector-icons/Ionicons').default,
};

const HeaderSearch = props => {
  // const navigation = useNavigation();
  const navigation = props;
  const SearchIcon = IconComponents[ICONS.SEARCH.library];

  const handleSearchPress = () => {
    navigation.navigate(SCREENS.SEATCHSCRENN);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={handleSearchPress}
        activeOpacity={0.7}>
        <SearchIcon
          name={ICONS.SEARCH.name}
          size={ICONS.SEARCH.size}
          color={COLORS.PLACEHOLDER_COLOR}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Escríbelo, busca y encuentralo!"
          placeholderTextColor={COLORS.PLACEHOLDER_COLOR}
          editable={false} // El input no es editable, solo clickeable
        />
      </TouchableOpacity>

      <Text style={styles.exploreText}>EXPLORAR</Text>
    </View>
  );
};

export default HeaderSearch;
