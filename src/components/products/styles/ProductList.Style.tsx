import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    marginTop: SIZES.xLarge,
  },
  appBarWrapper: {
    paddingVertical: SIZES.small,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    elevation: 2,
    shadowColor: COLORS.gray,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryListContainer: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.xSmall,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
