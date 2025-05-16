import {StyleSheet, Dimensions} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.offwhite,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    // backgroundColor: COLORS.white,
    padding: SIZES.medium,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: SIZES.medium,
  },
  sectionContainer: {
    marginVertical: SIZES.medium,
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  upperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  imageContainer: {
    width: SCREEN_WIDTH - SIZES.medium * 2,
    height: SIZES.height * 0.4,
    borderRadius: SIZES.medium,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  details: {
    paddingVertical: SIZES.medium,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  price: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.red,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.medium,
  },
  detailsWrapper: {
    marginBottom: SIZES.medium,
  },
  detailItem: {
    fontSize: SIZES.medium - 2,
    color: COLORS.gray,
    marginBottom: SIZES.xSmall,
  },
  descriptionWrapper: {
    marginBottom: SIZES.medium,
  },
  descriptionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.xSmall,
  },
  description: {
    fontSize: SIZES.medium - 2,
    color: COLORS.gray,
    lineHeight: SIZES.medium + 2,
  },
  commentsWrapper: {
    marginTop: SIZES.medium,
  },
  commentsTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.medium,
  },
  commentItem: {
    marginBottom: SIZES.medium,
  },
  commentUser: {
    fontSize: SIZES.medium - 2,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.xSmall,
  },
  commentText: {
    fontSize: SIZES.medium - 2,
    color: COLORS.gray,
    marginBottom: SIZES.xSmall,
  },
  commentDate: {
    fontSize: SIZES.small,
    color: COLORS.gray2,
  },
  viewMoreComments: {
    fontSize: SIZES.medium - 2,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.offwhite,
  },
  storeError: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
  // Added missing styles
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  priceWrapper: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.xSmall,
    borderRadius: SIZES.small,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: SIZES.medium - 2,
    color: COLORS.gray,
    marginLeft: SIZES.small,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  cartBtn: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
    flex: 1,
    marginRight: SIZES.small,
  },
  cartTitle: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: SIZES.medium,
  },
  addCart: {
    backgroundColor: COLORS.black,
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.small,
  },
  contactText: {
    fontSize: SIZES.medium - 2,
    color: COLORS.blue,
    marginLeft: SIZES.small,
  },
});

export default styles;
