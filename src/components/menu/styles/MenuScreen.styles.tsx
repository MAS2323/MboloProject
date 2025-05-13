import {StyleSheet} from 'react-native';
import {COLORS, SIZES, FONTS} from '../../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  title: {
    textAlign: 'left',
    marginBottom: SIZES.medium,
    color: COLORS.gray, // Match the gray color in the image
    fontSize: SIZES.large, // Slightly larger for emphasis
    fontFamily: FONTS.MONTSERRAT_BOLD,
    textTransform: 'uppercase',
  },
  listContainer: {
    paddingBottom: SIZES.large,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    color: COLORS.primary,
  },
  errorText: {
    color: COLORS.red,
    fontFamily: FONTS.MONTSERRAT,
    textAlign: 'center',
    marginTop: SIZES.xLarge,
  },
});
