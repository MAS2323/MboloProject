import {StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    margin: SIZES.small / 2, // Tighten the margin for a closer grid
    backgroundColor: COLORS.white,
    borderRadius: 0, // No border radius for a cleaner look
    padding: SIZES.medium,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    aspectRatio: 1, // Make the item square
    maxWidth: '33%', // For 3 columns (100%/3 - margin)
    minWidth: '33%', // Ensure consistent width
  },
  image: {
    width: 50, // Smaller size for icons
    height: 50,
    marginBottom: SIZES.small,
    resizeMode: 'contain', // Better for icons
  },
  title: {
    fontFamily: FONTS.MONTSERRAT_BOLD,
    fontSize: SIZES.small, // Smaller font for better fit
    color: COLORS.gray, // Match the grayish text in the image
    textAlign: 'center',
  },
  // Remove subcategoriesContainer and subcategoryText since they're not in the image
});
