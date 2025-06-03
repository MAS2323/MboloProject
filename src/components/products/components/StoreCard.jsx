import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import styles from './styles/StoreCardStyle';
import SCREENS from '../../../screens';
// Mock COLORS and SIZES constants (adjust to match your constants/theme.js)

const StoreCard = ({store, productComments}) => {
  const navigation = useNavigation();

  if (!store) {
    return (
      <View style={styles.container}>
        <Text style={styles.storeError}>No hay información de la tienda</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.storeTitle}>Tienda</Text>
      <View
        style={styles.storeCard}
        // onPress={() => navigation.navigate(SCREENS.MY_STORE, {id: store.id})}
      >
        {store.logo ? (
          <Image source={{uri: store.logo}} style={styles.storeLogo} />
        ) : (
          <View style={[styles.storeLogo, styles.placeholderImage]}>
            <Ionicons name="storefront-outline" size={16} color={COLORS.gray} />
          </View>
        )}
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>
            {store.name || 'Tienda sin nombre'}
          </Text>
          <Text style={styles.storeStats}>
            Calificación: {store.rating || '4.7'} ({store.reviews || '3000+'})
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(SCREENS.TIENDA_DETALLE_SCREEN, {id: store.id})
          }
          style={styles.storeButton}>
          <Text style={styles.storeButtonText}>Visitar tienda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StoreCard;
