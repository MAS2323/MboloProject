// components/menu/MenuSection.styles.js
import {StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../../constants';
export default StyleSheet.create({
  container: {
    marginBottom: SIZES.large,
  },
  title: {
    fontFamily: FONTS.MONTSERRAT_BOLD,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginBottom: SIZES.small,
    paddingLeft: SIZES.small,
  },
  content: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
  },
});
