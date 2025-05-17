import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles/SearchBar.styles';
import {ICONS} from '../../../constants';

// Importar componentes de iconos dinámicamente
const IconComponents = {
  Feather: require('react-native-vector-icons/Feather').default,
  Ionicons: require('react-native-vector-icons/Ionicons').default,
};

const SearchBar = ({onPress}) => {
  const SearchIcon = IconComponents[ICONS.SEARCH.library];

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}>
        <SearchIcon
          name={ICONS.SEARCH.name}
          size={ICONS.SEARCH.size}
          style={styles.searchIcon}
        />
        <Text style={styles.placeholderText}>
          Escríbelo, busca y encuentralo!
        </Text>
      </TouchableOpacity>
      <Text style={styles.exploreText}>EXPLORAR</Text>
    </View>
  );
};

export default SearchBar;
