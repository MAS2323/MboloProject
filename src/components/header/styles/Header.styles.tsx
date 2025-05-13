// components/header/Header.styles.js
import {StyleSheet} from 'react-native';
// import {FONTS, COLORS, SHADOWS} from '../../../constants';

import {FONTS, COLORS, SHADOWS, SIZES} from '../../../constants';

export default StyleSheet.create({
  container: {
    width: '100%',
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    // ...SHADOWS.medium,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    padding: SIZES.small,
  },
  icon: {
    color: COLORS.black,
  },
  locationTitle: {
    textAlign: 'center',
    marginTop: 7,
    letterSpacing: 4,
    marginBottom: 5,
    color: COLORS.gray,
    fontFamily: FONTS.MONTSERRAT_MEDIUM,
    fontSize: SIZES.medium,
  },
});
