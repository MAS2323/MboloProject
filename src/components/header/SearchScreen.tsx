// screens/SearchScreen/SearchScreen.js
import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import styles from './styles/SearchBar.styles';
import SearchBar from './SearchBar';

// Componente de resultado de búsqueda (ejemplo)
const SearchResultItem = ({item}) => (
  <View style={styles.resultItem}>
    <Text style={styles.resultText}>{item}</Text>
  </View>
);

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  // Datos de ejemplo - reemplazar con tu lógica de búsqueda real
  const mockResults = [
    'Resultado 1',
    'Resultado 2',
    'Resultado 3',
    'Resultado 4',
    'Resultado 5',
  ];

  const handleSearch = query => {
    setSearchQuery(query);
    // Aquí iría tu lógica de búsqueda real
    setResults(
      mockResults.filter(item =>
        item.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar searchQuery={searchQuery} onSearchChange={handleSearch} />

      <FlatList
        data={results}
        renderItem={({item}) => <SearchResultItem item={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.resultsContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No se encontraron resultados'
              : 'Escribe para buscar'}
          </Text>
        }
      />
    </View>
  );
};

export default SearchScreen;
