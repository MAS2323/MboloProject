import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import styles from './styles/ProductCardView.Style';
import {COLORS, ICONS} from '../../constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../../config/Service.Config';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import SCREENS from '../../screens';

// Map icon libraries dynamically
const IconComponents: {[key: string]: any} = {
  Feather: require('react-native-vector-icons/Feather').default,
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};

interface ProductImage {
  url: string;
}

interface ProductItem {
  _id: string;
  title: string;
  supplier: string;
  price: number;
  images?: ProductImage[];
}

interface ProductCardViewProps {
  item: ProductItem;
}

const ProductCardView: React.FC<ProductCardViewProps> = ({item}) => {
  if (!item || !item.title || !item.supplier || !item.price || !item._id) {
    return null;
  }

  const AddCircleIcon = IconComponents[ICONS.ADDCIRCLE.library];

  // Define your navigation param types
  type RootStackParamList = {
    [SCREENS.PRODUCT_DETAIL]: {item: ProductItem};
    // ...other screens if needed
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        setUserId(id ? id.replace(/"/g, '') : null);
      } catch (error) {
        console.error('Error retrieving userId:', error);
        setUserId(null);
      }
    };
    getUserId();
  }, []);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/add/${userId}/${item._id}`,
      );
      if (response.status === 200) {
        Alert.alert('Success', 'Product added to cart');
      } else {
        Alert.alert('Error', 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object' &&
        (error as any).response !== null &&
        'data' in (error as any).response
      ) {
        console.error('Server response:', (error as any).response.data);
      }
      Alert.alert('Error', 'There was an error adding the product to the cart');
    } finally {
      setIsLoading(false);
    }
  };

  const firstImage =
    item.images && item.images.length > 0 ? item.images[0].url : null;

  console.log('Navigating to', SCREENS.PRODUCT_DETAIL, 'with item:', item);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(SCREENS.PRODUCT_DETAIL, {item})}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {firstImage ? (
            <Image
              source={{uri: firstImage}}
              style={styles.image}
              onError={e =>
                console.log('Image load error:', e.nativeEvent.error)
              }
            />
          ) : (
            <Text style={styles.noImageText}>No hay imagen disponible</Text>
          )}
        </View>
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.supplier} numberOfLines={1}>
            {item.supplier}
          </Text>
          <Text style={styles.price}>XAF {item.price}</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddToCart}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : AddCircleIcon ? (
            <AddCircleIcon
              name={ICONS.ADDCIRCLE.name}
              size={ICONS.ADDCIRCLE.size}
              color={COLORS.primary}
            />
          ) : (
            <Text>Icon not available</Text> // Fallback if icon fails to render
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCardView;
