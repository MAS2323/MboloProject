import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './styles/SearchScreenStyles';

const SearchTile = ({item}) => {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.navigate('ProductDetails', {id: item._id})}>
        <View style={styles.image}>
          <Image
            source={{
              uri: item.images?.[0]?.url || 'https://via.placeholder.com/50',
            }}
            style={styles.productImg}
          />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={styles.productTitle}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.title || 'Producto sin título'}
          </Text>
          <Text style={styles.supplier} numberOfLines={1} ellipsizeMode="tail">
            {item.supplier || 'Proveedor no especificado'}
          </Text>
          <Text style={styles.supplier}>XAF {item.price || '0'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SearchTile;
