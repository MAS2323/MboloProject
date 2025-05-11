// components/Header.js
import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
// import {Ionicons} from '@expo/vector-icons';
// import {Fontisto} from '@expo/vector-icons';
import styles from './styles/mainHeader';
const Header = ({location}) => {
  return (
    <View style={[styles.appBarWrapper, {marginTop: 53}]}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => {}}>
          {/* <Ionicons name="location-outline" size={30} color="black" /> */}
        </TouchableOpacity>
        <Text style={styles.location}>{location}</Text>
        <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity
          //   onPress={() => router.push('/cart/CartScreen')}
          >
            {/* <Fontisto name="shopping-bag" size={24} color={COLORS.black} /> */}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;
