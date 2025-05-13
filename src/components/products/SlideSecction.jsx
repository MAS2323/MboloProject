import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import {ICONS} from '../../constants';
import SlideSectionStyles from './styles/SlideSection.styles';
import {useNavigation} from '@react-navigation/native';
import SCREENS from '../../screens';

const IconComponents = {
  Feather: require('react-native-vector-icons/Feather').default,
  AntDesign: require('react-native-vector-icons/AntDesign').default,
};
const SlideSection = () => {
  const navigation = useNavigation();
  const StoresIcon = IconComponents[ICONS.STORE.library];
  return (
    <View style={SlideSectionStyles.container}>
      <View style={SlideSectionStyles.header}>
        <Text style={SlideSectionStyles.headerTitle}>Vende y Compra!</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.PRODUCT_LIST)}>
          <StoresIcon
            name={ICONS.STORE.name}
            size={ICONS.STORE.size}
            color="#4c86A8"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SlideSection;
