import {Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 44,
  height,
  width,
};

export default SIZES;
