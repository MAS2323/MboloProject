// screens/SearchScreen/SearchBar.styles.js
import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';
// import COLORS from '../../../constants/colors';
export default StyleSheet.create({
  searchIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginVertical: SIZES.medium,
    height: 50,
    marginHorizontal: 12,
  },
  searchIcon: {
    marginHorizontal: 10,
    color: COLORS.gray,
    marginTop: SIZES.small,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    marginRight: SIZES.small,
    borderRadius: SIZES.small,
  },
  searchInput: {
    width: '100%',
    height: '100%',
    paddingHorizontal: SIZES.small,
    fontFamily: 'Montserrat-Regular',
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  searchBtn: {
    width: 50,
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
