import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from './styles/tendenciaGalleryScreen';
import {ICONS, COLORS} from '../../constants';
const {width} = Dimensions.get('window');

const IconComponents = {
  Ionicons: require('react-native-vector-icons/Ionicons').default,
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};
const TendenciaGalleryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {images, index} = route.params || {};
  const [imageList, setImageList] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const BackArrowIcon = IconComponents[ICONS.BACK_ARROW.library];
  useEffect(() => {
    try {
      const parsedImages =
        typeof images === 'string' ? JSON.parse(images) : images;
      if (Array.isArray(parsedImages)) {
        setImageList(parsedImages);
        setStartIndex(index ? parseInt(index, 10) : 0);
        setCurrentIndex(index ? parseInt(index, 10) : 0);
      } else {
        console.warn('No se pudieron cargar las imágenes');
      }
    } catch (error) {
      console.error(
        'Error al parsear imágenes:',
        error,
        'Images value:',
        images,
      );
    }
  }, [images, index]);

  return (
    <View style={styles.container}>
      {/* Botón para cerrar */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.closeButton}>
        <BackArrowIcon
          name={ICONS.BACK_ARROW.name}
          size={ICONS.BACK_ARROW.size || 24}
          color={COLORS.white}
        />
      </TouchableOpacity>

      {/* FlatList para navegar entre imágenes */}
      {imageList.length > 0 ? (
        <>
          <FlatList
            data={imageList}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={startIndex}
            keyExtractor={(item, i) => i.toString()}
            getItemLayout={(data, i) => ({
              length: width,
              offset: width * i,
              index: i,
            })}
            onMomentumScrollEnd={event => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              setCurrentIndex(index);
            }}
            renderItem={({item}) => (
              <View style={styles.imageContainer}>
                <Image source={{uri: item.url}} style={styles.image} />
              </View>
            )}
          />

          {/* Contador de imágenes */}
          <View style={styles.imageCounter}>
            <Text style={styles.counterText}>
              {currentIndex + 1} / {imageList.length}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="image-outline" size={50} color="white" />
          <Text style={styles.emptyText}>No hay imágenes disponibles</Text>
        </View>
      )}
    </View>
  );
};

export default TendenciaGalleryScreen;
