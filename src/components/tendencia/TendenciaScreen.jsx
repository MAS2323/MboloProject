import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Linking,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import styles from './styles/TendenciaScreenStyle';
import ICONS from '../../constants/icons';
import {API_BASE_URL} from '../../config/Service.Config';
import SCREENS from '../../screens';
// Define IconComponents for all required libraries
const IconComponents = {
  Ionicons: require('react-native-vector-icons/Ionicons').default,
  SimpleLineIcons: require('react-native-vector-icons/SimpleLineIcons').default,
  MaterialCommunityIcons:
    require('react-native-vector-icons/MaterialCommunityIcons').default,
  Fontisto: require('react-native-vector-icons/Fontisto').default,
  Entypo: require('react-native-vector-icons/Entypo').default,
  AntDesign: require('react-native-vector-icons/AntDesign').default,
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  Feather: require('react-native-vector-icons/Feather').default,
};

// Debug imports
console.log('IconComponents:', IconComponents);

// Dynamic Icon component to render icons based on library
const Icon = ({library, name, size, color, style}) => {
  const IconComponent = IconComponents[library];
  if (!IconComponent) {
    console.warn(`Icon library "${library}" not found`);
    return null;
  }
  return <IconComponent name={name} size={size} color={color} style={style} />;
};

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const TendenciaScreen = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigation = useNavigation();

  // useEffect(() => {
  //   const getUserId = async () => {
  //     try {
  //       const id = await AsyncStorage.getItem('id');
  //       if (id) {
  //         setUserId(id.replace(/\"/g, ''));
  //       } else {
  //         console.error('Error: userId is null');
  //       }
  //     } catch (error) {
  //       console.error('Error getting userId from AsyncStorage:', error);
  //     }
  //   };

  //   getUserId();
  // }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/menus`);
        const shuffledSubcategories = shuffleArray(response.data);
        setSubcategories(shuffledSubcategories);
        setVisibleItems(shuffledSubcategories.slice(0, 5));
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategories();
  }, []);

  const loadMoreItems = useCallback(() => {
    if (visibleItems.length < subcategories.length && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        const nextItems = subcategories.slice(
          visibleItems.length,
          visibleItems.length + 3,
        );
        setVisibleItems(prev => [...prev, ...nextItems]);
        setIsLoadingMore(false);
      }, 500);
    }
  }, [visibleItems, subcategories, isLoadingMore]);

  const handlePress = subcategory => {
    navigation.navigate(SCREENS.DETALLE_SCREEN, {item: subcategory});
  };

  const handleCall = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = phoneNumber => {
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  const renderItem = useCallback(
    ({item}) => (
      <View key={item._id}>
        <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
          <Image
            source={{
              uri: item.images?.[0]?.url || 'https://via.placeholder.com/150',
            }}
            style={styles.image}
          />
          <View style={styles.infoContainer}>
            <View style={styles.locationContainer}>
              <Text style={styles.location}>
                <Icon
                  library={ICONS.LOCATION.library}
                  name={ICONS.LOCATION.name}
                  size={ICONS.LOCATION.size}
                  color="#4c86A8"
                />{' '}
                {item.location
                  ? `${item.location.city}, ${item.location.province}`
                  : 'N/A'}
              </Text>
            </View>
            <Text style={styles.price}>Precio: ${item.price || 'N/A'}</Text>
            <Text style={styles.description}>
              {item.description ||
                'Descripción corta del producto o tendencia.'}
            </Text>
            <View style={styles.contactContainer}>
              <TouchableOpacity
                style={styles.whatsappButton}
                onPress={() => handleWhatsApp(item.whatsapp)}>
                <Text style={styles.whatsappText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.IconButton}
                onPress={() => handleCall(item.phoneNumber)}>
                <Icon
                  library={ICONS.PHONE.library}
                  name={ICONS.PHONE.name}
                  size={ICONS.PHONE.size}
                  color="#4c86A8"
                  style={styles.callIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback(item => item._id, []);

  const renderFooter = useCallback(() => {
    return isLoadingMore ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4c86A8" />
      </View>
    ) : null;
  }, [isLoadingMore]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tendencias</Text>
        <Icon
          library={ICONS.TENDENCIA.library}
          name={ICONS.TENDENCIA.name}
          size={ICONS.TENDENCIA.size}
          color="#4c86A8"
        />
      </View>
      <FlatList
        data={visibleItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        nestedScrollEnabled={true}
        initialNumToRender={5}
        maxToRenderPerBatch={3}
        windowSize={7}
        removeClippedSubviews={true}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        overScrollMode="always"
        bounces={true}
        decelerationRate="normal"
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default TendenciaScreen;
