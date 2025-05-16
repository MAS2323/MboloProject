import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SIZES.small,
    backgroundColor: COLORS.lightwhite,
    borderRadius: SIZES.xSmall,
    paddingHorizontal: SIZES.xSmall,
  },
  searchIcon: {
    marginRight: SIZES.xSmall,
  },
  searchWrapper: {
    flex: 1,
  },
  searchInput: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    paddingVertical: SIZES.xSmall,
  },
  searchBtn: {
    padding: SIZES.xSmall,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.xSmall,
  },
  resultsContainer: {
    paddingHorizontal: SIZES.small,
    paddingBottom: SIZES.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: SIZES.medium,
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
  searchTile: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.xSmall,
    padding: SIZES.small,
    marginVertical: SIZES.xSmall,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tileImage: {
    width: 50,
    height: 50,
    borderRadius: SIZES.xSmall,
    marginRight: SIZES.small,
  },
  tileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  tileTitle: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: '600',
  },
  tilePrice: {
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
});

export default styles;
