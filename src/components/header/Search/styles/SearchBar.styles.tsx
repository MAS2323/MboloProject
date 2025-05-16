import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../../constants';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0FA', // Light blue background from the image
    borderRadius: SIZES.medium,
    marginVertical: SIZES.medium,
    marginHorizontal: SIZES.small,
    height: 50,
    paddingHorizontal: SIZES.small,
  },
  searchIcon: {
    marginRight: SIZES.small,
    color: COLORS.gray, // Match the grayish icon color in the image
  },
  placeholderText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: SIZES.medium,
    color: COLORS.gray, // Match the placeholder text color
    padding: 0,
  },
  exploreText: {
    textAlign: 'center',
    marginTop: SIZES.small,
    letterSpacing: 4,
    color: COLORS.gray,
    fontFamily: 'Montserrat-Medium',
    fontSize: SIZES.small,
    textTransform: 'uppercase',
  },
});
