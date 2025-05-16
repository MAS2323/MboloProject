import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import styles from './styles/SearchScreenStyles';
import {API_BASE_URL} from '../../../config/Service.Config';
import IMAGES from '../../../assets/images';
import {COLORS} from '../../../constants';

// Mock SearchTile component (replace with your actual SearchTile)
const SearchTile = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.searchTile}
      onPress={() => navigation.navigate('ProductDetails', {id: item._id})}>
      <Image
        source={{
          uri: item.images?.[0]?.url || 'https://via.placeholder.com/50',
        }}
        style={styles.tileImage}
      />
      <View style={styles.tileInfo}>
        <Text style={styles.tileTitle} numberOfLines={1} ellipsizeMode="tail">
          {item.title || 'Producto sin título'}
        </Text>
        <Text style={styles.tilePrice}>XAF {item.price || '0'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Handle search (server-side API call)
  const handleSearch = async (query = searchQuery) => {
    try {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const response = await axios.get(
        `${API_BASE_URL}/products/search/${query}`,
      );
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Failed to get products:', error.message);
      setSearchResults([]);
    }
  };

  // Handle text input change (real-time search)
  const handleTextChange = text => {
    setSearchQuery(text);
    handleSearch(text); // Trigger search on text change
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={24}
          color={COLORS.black}
          style={styles.searchIcon}
        />
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleTextChange}
            placeholder="Todo lo que desees en un click!"
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => handleSearch()}>
          <Feather name="search" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      {searchResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={IMAGES.RESEACH} style={styles.searchImage} />
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No se encontraron resultados'
              : 'Escribe para buscar'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={item => item._id}
          renderItem={({item}) => <SearchTile item={item} />}
          contentContainerStyle={styles.resultsContainer}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
