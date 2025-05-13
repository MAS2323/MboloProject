// screens/SearchScreen/SearchBar.js
import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import styles from './styles/SearchBar.styles';
import {ICONS, COLORS} from '../../constants';

// Importar componentes de iconos dinámicamente
const IconComponents = {
  Feather: require('react-native-vector-icons/Feather').default,
  Ionicons: require('react-native-vector-icons/Ionicons').default,
};

const SearchBar = ({onSearchChange, searchQuery}) => {
  const SearchIcon = IconComponents[ICONS.SEARCH.library];
  const CameraIcon = IconComponents[ICONS.CAMERA.library];

  return (
    <View style={styles.searchIconContainer}>
      <TouchableOpacity>
        <SearchIcon
          name={ICONS.SEARCH.name}
          size={ICONS.SEARCH.size}
          style={styles.searchIcon}
        />
      </TouchableOpacity>

      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          placeholderTextColor={COLORS.gray}
          autoFocus={true}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      <TouchableOpacity style={styles.searchBtn}>
        <CameraIcon
          name={ICONS.CAMERA.name}
          size={ICONS.CAMERA.size}
          color={COLORS.white}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
