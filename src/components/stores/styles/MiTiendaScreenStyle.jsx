import {StyleSheet, Dimensions} from 'react-native';
import {COLORS} from '../../../constants';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offwhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: 0.5,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  tiendaCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  tiendaBanner: {
    width: '100%',
    height: 200, // Increased for better visual impact
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tiendaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
  },
  tiendaLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    resizeMode: 'cover', // Changed to 'cover' for better image scaling
    backgroundColor: COLORS.lightwhite,
  },
  tiendaTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.black,
    flex: 1,
    letterSpacing: 0.5,
  },
  productsHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.black,
    marginVertical: 16,
    letterSpacing: 0.3,
  },
  productsList: {
    marginBottom: 24,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  productImage: {
    width: 100, // Slightly larger for better visuals
    height: 100,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: COLORS.lightwhite,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary, // Changed to primary for emphasis
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 22,
    opacity: 0.8,
  },
  emptyProductsText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginVertical: 24,
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: COLORS.offwhite,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.gray,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 26,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  createButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.offwhite,
  },
  placeholderImage: {
    backgroundColor: COLORS.lightwhite,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Slightly darker for better contrast
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBannerBackground: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    opacity: 0.3, // Reduced opacity for better readability
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly more opaque
    borderRadius: 16,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  modalLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    resizeMode: 'cover',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: 0.3,
  },
  modalDetailsContainer: {
    padding: 16,
  },
  tiendaDetails: {
    padding: 12,
  },
  tiendaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 12,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  tiendaText: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 24,
    opacity: 0.9,
  },
});

export default styles;
