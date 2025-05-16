import {StyleSheet, Dimensions} from 'react-native';
import {COLORS, SIZES} from '../../../../constants';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.medium,
    paddingHorizontal: SIZES.medium,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.medium,
  },
  noProductsText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  column: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: SIZES.medium,
  },
  productWrapper: {
    width: width * 0.4,
    marginRight: SIZES.small,
  },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    borderRadius: SIZES.small,
    overflow: 'hidden',
  },
  productImage: {
    width: '100',
    height: '100%',
    resizeMode: 'cover',
  },
  productTitle: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    color: COLORS.black,
    marginVertical: SIZES.xSmall,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontWeight: '600',
  },
  placeholderCard: {
    width: width * 0.4,
    height: 200,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.small,
    marginRight: SIZES.small,
  },
  flatListContent: {
    paddingVertical: SIZES.small,
  },
});

export default styles;
