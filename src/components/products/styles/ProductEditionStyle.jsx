import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: COLORS.background || '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white || '#FFFFFF',
    // elevation: 2, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButtonHeader: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text || '#333',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight || '#E6F0FF',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  imageSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text || '#333',
    marginBottom: 12,
  },
  imageSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: COLORS.white || '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border || '#E0E0E0',
    borderStyle: 'dashed',
    marginRight: 12,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border || '#E0E0E0',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.error || '#FF3B30',
    borderRadius: 12,
    padding: 2,
  },
  imageList: {
    paddingHorizontal: 4,
    margin: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.placeholder || '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  details: {
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text || '#333',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text || '#333',
    backgroundColor: COLORS.inputBackground || '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border || '#E0E0E0',
  },
  priceInput: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text || '#333',
    backgroundColor: COLORS.inputBackground || '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border || '#E0E0E0',
  },
  descriptionInput: {
    fontSize: 16,
    color: COLORS.text || '#333',
    backgroundColor: COLORS.inputBackground || '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border || '#E0E0E0',
    height: 100,
    textAlignVertical: 'top',
  },
  locationInput: {
    fontSize: 16,
    color: COLORS.text || '#333',
    backgroundColor: COLORS.inputBackground || '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border || '#E0E0E0',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  contactInput: {
    fontSize: 16,
    color: COLORS.text || '#333',
    backgroundColor: COLORS.inputBackground || '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border || '#E0E0E0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background || '#F5F5F5',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error || '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: COLORS.primary || '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.white || '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default styles;
