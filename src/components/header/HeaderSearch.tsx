import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React from 'react';
import {useRouter} from 'expo-router';
import styles from './styles/HeaderStyle';
import Icon from 'react-native-vector-icons/FontAwesome';

const HeaderScreen = ({title}) => {
  return (
    <View>
      <View style={styles.searchIconContainer}>
        <TouchableOpacity>
          <Icon
            name="search"
            size={24}
            color="black"
            style={styles.searchIcon}
          />
        </TouchableOpacity>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value=""
            onPressIn={() => router.push('/cart/SearchScreen')}
            placeholder="Escribelo, busca y encuentralo!"
          />
        </View>
        {/* <View>
          <TouchableOpacity style={styles.searchBtn}>
            <Ionicons name="camera-outline" size={SIZES.xLarge} color="black" />
          </TouchableOpacity>
        </View> */}
      </View>

      <View>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 7,
            letterSpacing: 4,
            marginBottom: 5,
            color: 'gray',
          }}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default HeaderScreen;
