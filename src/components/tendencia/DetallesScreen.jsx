import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TendenciaScreen from './TendenciaScreen';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from './styles/DetallesScreenStyle';
import SCREENS from '../../screens';

const DetallesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {item: subcategory} = route.params || {};
  const images = subcategory?.images || [];

  const handleImagePress = index => {
    console.log(
      'Navigating to tendenciaGalleryScreen with images:',
      images,
      'index:',
      index,
    );
    navigation.navigate(SCREENS.IMAGE_GALLERY_SCREEN, {
      images: JSON.stringify(images),
      index: index.toString(),
    });
  };

  const handleCall = phoneNumber => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      console.warn('No phone number provided');
    }
  };

  const handleWhatsApp = phoneNumber => {
    if (phoneNumber) {
      Linking.openURL(`https://wa.me/${phoneNumber}`);
    } else {
      console.warn('No WhatsApp number provided');
    }
  };

  if (!subcategory) {
    return (
      <View style={styles.container}>
        <Text>No se encontraron detalles para este producto.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <FlatList
            horizontal
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => handleImagePress(index)}
                activeOpacity={0.8}>
                <Image
                  source={{
                    uri: item.url || 'https://via.placeholder.com/150',
                  }}
                  style={styles.image}
                />
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageList}
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.title}>{subcategory.name || 'Producto'}</Text>
          <Text style={styles.supplier}>
            {subcategory.description || 'Descripción no disponible.'}
          </Text>
          <Text style={styles.price}>
            Precio: ${subcategory.price || 'N/A'}
          </Text>
          <View style={styles.contactContainer}>
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={() => handleWhatsApp(subcategory.whatsapp)}>
              <Text style={styles.whatsappText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.IconButton}
              onPress={() => handleCall(subcategory.phoneNumber)}>
              <Ionicons name="call" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <FlatList
        data={[{}]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <TendenciaScreen />}
      />
    </View>
  );
};

export default DetallesScreen;
