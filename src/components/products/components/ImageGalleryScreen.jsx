import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Text,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, ICONS} from '../../../constants';

const {width, height} = Dimensions.get('window');
const IconComponents = {
  Ionicons: require('react-native-vector-icons/Ionicons').default,
};

const ImageGalleryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {images, index} = route.params || {};
  const [imageList, setImageList] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const ImageIcone = IconComponents[ICONS.IMAGE_OUTLINE.library];
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
      console.error('Error al parsear imágenes:', error);
    }
  }, [images, index]);

  return (
    <View style={styles.container}>
      {/* Botón para cerrar */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.closeButton}>
        <Ionicons name="close" size={30} color="white" />
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
                <Image
                  source={{uri: item.url}}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          {/* Contador de imágenes */}
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {currentIndex + 1} / {imageList.length}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <ImageIcone
            name={ICONS.IMAGE_OUTLINE.name}
            size={ICONS.IMAGE_OUTLINE.size}
            color={COLORS.white}
          />
          <Text style={styles.emptyText}>No hay imágenes disponibles</Text>
        </View>
      )}
    </View>
  );
};

export default ImageGalleryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  imageContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height * 0.8,
  },
  counterContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 10,
  },
  counterText: {
    color: 'white',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
});
