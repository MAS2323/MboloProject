import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../constants';

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.xSmall,
    paddingHorizontal: SIZES.small,
    backgroundColor: COLORS.white,
    marginVertical: SIZES.xSmall,
  },
  storeTitle: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: '600',
    marginBottom: SIZES.xSmall,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.xSmall,
    elevation: 0,
  },
  storeLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.xSmall,
    resizeMode: 'contain',
  },
  placeholderImage: {
    backgroundColor: COLORS.lightwhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SIZES.xSmall / 2,
  },
  storeStats: {
    fontSize: SIZES.small - 2,
    color: COLORS.gray,
  },
  storeButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 4,
    paddingVertical: SIZES.xSmall / 2,
    paddingHorizontal: SIZES.xSmall,
  },
  storeButtonText: {
    fontSize: SIZES.small - 2,
    color: COLORS.white,
    fontWeight: '600',
  },
  storeError: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default styles;
