import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.background || '#F5F5F5',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white || '#FFFFFF',
    // elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight || '#E6F0FF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text || '#333',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  tiendaCard: {
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  bannerContainer: {
    position: 'relative',
  },
  tiendaBanner: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tiendaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  tiendaLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.primary || '#007AFF',
    resizeMode: 'contain',
    backgroundColor: COLORS.white || '#FFFFFF',
  },
  tiendaTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text || '#333',
    flex: 1,
  },
  editStoreButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight || '#E6F0FF',
  },
  productsHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text || '#333',
    marginBottom: 12,
  },
  productsList: {
    marginBottom: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text || '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary || '#007AFF',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: COLORS.placeholder || '#999',
    lineHeight: 18,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight || '#E6F0FF',
  },
  emptyProductsContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyProductsText: {
    fontSize: 16,
    color: COLORS.placeholder || '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background || '#F5F5F5',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.placeholder || '#999',
    marginBottom: 16,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: COLORS.primary || '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  createButtonText: {
    fontSize: 16,
    color: COLORS.white || '#FFFFFF',
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background || '#F5F5F5',
  },
  placeholderImage: {
    backgroundColor: COLORS.lightwhite || '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBannerBackground: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    opacity: 0.3,
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: 12,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || '#E0E0E0',
  },
  modalLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.primary || '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text || '#333',
  },
  modalDetailsContainer: {
    padding: 16,
  },
  tiendaDetails: {
    paddingBottom: 16,
  },
  tiendaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text || '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  tiendaText: {
    fontSize: 14,
    color: COLORS.placeholder || '#999',
    lineHeight: 20,
  },
});

export default styles;
