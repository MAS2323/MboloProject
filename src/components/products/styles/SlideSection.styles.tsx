import {StyleSheet} from 'react-native';
import {SIZES, COLORS} from '../../../constants';

export default StyleSheet.create({
  container: {
    marginTop: SIZES.medium,
    marginHorizontal: SIZES.small,
    backgroundColor: '#F5F7FA',
    paddingVertical: SIZES.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  slideIcon: {
    marginRight: SIZES.small,
  },
  headerTitle: {
    textAlign: 'center',
    letterSpacing: 1,
    color: COLORS.gray,
    fontSize: SIZES.large,
    fontFamily: 'Montserrat-Medium',
    flex: 1,
  },
});
