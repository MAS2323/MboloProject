import {StyleSheet, Dimensions} from 'react-native';
import {COLORS, SIZES} from '../../../../constants';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.xSmall,
    backgroundColor: COLORS.white,
    marginVertical: SIZES.xSmall,
  },
  title: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: '600',
    marginBottom: SIZES.small,
    marginLeft: SIZES.xSmall,
  },
  flatListContent: {
    paddingHorizontal: SIZES.xSmall,
  },
  column: {
    flexDirection: 'column',
    marginRight: SIZES.xSmall,
    width: (SCREEN_WIDTH - SIZES.xSmall * 4) / 3,
  },
  productWrapper: {
    padding: SIZES.xSmall / 2,
  },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.xSmall,
    padding: SIZES.xSmall,
    alignItems: 'center',
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  placeholderCard: {
    width: (SCREEN_WIDTH - SIZES.xSmall * 4) / 3 - SIZES.xSmall * 2,
    height: (SCREEN_WIDTH - SIZES.xSmall * 4) / 3 + SIZES.medium,
  },
  imageContainer: {
    width: (SCREEN_WIDTH - SIZES.xSmall * 4) / 3 - SIZES.xSmall * 2,
    height: (SCREEN_WIDTH - SIZES.xSmall * 4) / 3 - SIZES.xSmall * 2,
    marginBottom: SIZES.xSmall / 2,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.xSmall,
  },
  productTitle: {
    fontSize: SIZES.small - 2,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SIZES.xSmall / 2,
    lineHeight: SIZES.small,
    width: '100%',
  },
  productPrice: {
    fontSize: SIZES.small - 2,
    color: '#FF6200',
    fontWeight: '600',
  },
  loadingContainer: {
    padding: SIZES.medium,
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginVertical: SIZES.medium,
  },
});

export default styles;
