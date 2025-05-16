import React from 'react';
import {FlatList, View, Text, ActivityIndicator} from 'react-native';
import {COLORS, SIZES} from '../../constants';
import ProductCardView from './ProductCardView';
import styles from './styles/ProductRow.Style';
import useFetch from '../../Hook/useFetch';
import {API_BASE_URL} from '../../config/Service.Config';

const ProductRow = () => {
  const {data, isLoading, error} = useFetch(`${API_BASE_URL}/products`);
  console.log('ProductRow - Data:', data); // Debug log

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size={SIZES.xxLarge} color={COLORS.primary} />
      ) : error ? (
        <Text>Hay algo que molesta</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item._id}
          renderItem={({item}) => {
            console.log('ProductRow - Rendering item:', item); // Debug log
            return <ProductCardView item={item} />;
          }}
          horizontal
          contentContainerStyle={{columnGap: SIZES.medium}}
        />
      )}
    </View>
  );
};

export default ProductRow;
