// components/menu/MenuItem.styles.js
import {StyleSheet} from 'react-native';
import {SIZES} from '../../../constants';
import {FONTS, SHADOWS} from '../../../constants';
import COLORS from '../../../constants/colors';

export default StyleSheet.create({
  menuContainer: {
    marginBottom: SIZES.large,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    ...SHADOWS.small,
  },
  menuTitle: {
    fontFamily: FONTS.MONTSERRAT_BOLD,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  menuItem: {
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  menuItemText: {
    fontFamily: FONTS.MONTSERRAT,
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
});
