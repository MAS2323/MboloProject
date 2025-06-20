import {StyleSheet, Dimensions} from 'react-native';
import {COLORS, SIZES} from '../../../constants';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG || '#F5F5F5',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionContainer: {
    marginVertical: SIZES.small,
    padding: SIZES.medium,
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageSectionContainer: {
    position: 'relative',
    marginVertical: 0,
    padding: 0,
  },
  upperRow: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.medium,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.35,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginHorizontal: SCREEN_WIDTH * 0.35,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray || '#999',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary || '#007AFF',
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
    fontSize: SIZES.xLarge + 2,
    fontWeight: '700',
    color: COLORS.primary || '#007AFF',
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.BLACK || '#333',
    marginBottom: SIZES.medium,
  },
  detailsWrapper: {
    marginBottom: SIZES.medium,
    padding: SIZES.small,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  detailItem: {
    fontSize: SIZES.medium - 2,
    color: COLORS.PLACEHOLDER_COLOR || '#999',
    marginBottom: SIZES.xSmall,
  },
  descriptionWrapper: {
    marginBottom: SIZES.medium,
  },
  descriptionTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.BLACK || '#333',
    marginBottom: SIZES.small,
  },
  description: {
    fontSize: SIZES.medium - 2,
    color: COLORS.PLACEHOLDER_COLOR || '#999',
    lineHeight: SIZES.medium + 4,
  },
  commentsWrapper: {
    marginTop: SIZES.medium,
    padding: SIZES.small,
    backgroundColor: COLORS.GRAY_LIGHT || '#F9F9F9',
    borderRadius: 8,
  },
  commentsTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.BLACK || '#333',
    marginBottom: SIZES.medium,
  },
  commentItem: {
    marginBottom: SIZES.medium,
    padding: SIZES.small,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary || '#007AFF',
  },
  commentUser: {
    fontSize: SIZES.medium - 2,
    fontWeight: '600',
    color: COLORS.BLACK || '#333',
    marginBottom: SIZES.xSmall,
  },
  commentText: {
    fontSize: SIZES.medium - 2,
    color: COLORS.PLACEHOLDER_COLOR || '#999',
    marginBottom: SIZES.xSmall,
  },
  commentDate: {
    fontSize: SIZES.small,
    color: COLORS.gray2 || '#BBB',
  },
  viewMoreComments: {
    fontSize: SIZES.medium - 2,
    color: COLORS.primary || '#007AFF',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BG || '#F5F5F5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BG || '#F5F5F5',
    padding: SIZES.medium,
  },
  errorText: {
    fontSize: SIZES.medium,
    color: '#FF3B30',
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary || '#007AFF',
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.white || '#FFFFFF',
    fontWeight: '600',
  },
  contactWrapper: {
    marginTop: 10,
  },
  contactButtons: {
    flexDirection: 'row',
    marginTop: 5,
    gap: 10,
    justifyContent: 'space-between', // Ensures buttons are spread out
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 1, // Makes buttons take equal width
  },
  contactButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    marginLeft: 5,
  },
});

export default styles;
