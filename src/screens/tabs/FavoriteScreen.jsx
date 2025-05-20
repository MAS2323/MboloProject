import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
} from 'react-native';
import axios from 'axios';
import {MaterialIcons} from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../../config/Service.Config';
import {useNavigation} from '@react-navigation/native';
import SCREENS from '..';
import styles from './styles/FavoriteScreen';
import IMAGES from '../../assets/images';

const FavoriteScreen = () => {
  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        if (id) {
          setUserId(id.replace(/\"/g, ''));
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/favorites/${userId}`);
      const favoritesData = response.data?.subcategories || [];
      setFavorites(favoritesData);
    } catch (error) {
      console.error(
        'Error fetching favorites:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        'Failed to fetch favorites. Please try again later.',
      );
      setFavorites([]);
    }
  };

  const handleRemoveFavorite = async subcategoryId => {
    try {
      const userId = await AsyncStorage.getItem('id');
      const cleanedUserId = userId ? userId.replace(/\"/g, '') : null;

      await axios.delete(
        `${API_BASE_URL}/favorites/${userId}/${subcategoryId}`,
        {
          data: {userId: cleanedUserId, subcategoryId},
        },
      );
      setFavorites(prevFavorites =>
        prevFavorites.filter(fav => fav._id !== subcategoryId),
      );
      Alert.alert('Removed', 'The item has been removed from favorites.');
    } catch (error) {
      console.error(
        'Error removing favorite:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        'Failed to remove favorite. Please try again later.',
      );
    }
  };

  const handlePressItem = async favorite => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subcategories/${favorite._id}`,
      );
      const selectedSubcategory = response.data;
      if (!SCREENS.DETALLES_SCREEN) {
        console.error('SCREENS.DETALLES_SCREEN is undefined');
        Alert.alert('Error', 'DetallesScreen is not defined');
        return;
      }
      console.log(
        'Navigating to DetallesScreen with item:',
        selectedSubcategory,
      );
      navigation.navigate(SCREENS.DETALLES_SCREEN, {item: selectedSubcategory});
    } catch (error) {
      console.error('Error fetching subcategory details:', error);
      Alert.alert('Error', 'Failed to fetch subcategory details.');
    }
  };

  const renderFavoriteItem = ({item}) => (
    <TouchableOpacity onPress={() => handlePressItem(item)}>
      <View style={styles.card}>
        <Image
          source={{uri: item.image || 'https://via.placeholder.com/100'}}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.title || 'Sin título'}</Text>
          <Text style={styles.description}>
            {item.description || 'Sin descripción'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Remove from Favorites',
              `Are you sure you want to remove ${
                item.title || 'this item'
              } from favorites?`,
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Remove',
                  onPress: () => handleRemoveFavorite(item._id),
                  style: 'destructive',
                },
              ],
            )
          }>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={item => item._id}
        renderItem={renderFavoriteItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await fetchFavorites();
              setRefreshing(false);
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={IMAGES.FAVARITO}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>Aún no hay favoritos.</Text>
          </View>
        }
      />
    </View>
  );
};

export default FavoriteScreen;
