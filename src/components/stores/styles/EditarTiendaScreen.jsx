import {StyleSheet, Dimensions} from 'react-native';
import {COLORS} from '../../../constants';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE || '#F7F7F7', // Slightly off-white for a softer background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.WHITE || '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY || '#E8ECEF',
    elevation: 2, // Subtle shadow for Android
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.BLACK || '#1A1A1A',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 80, // Increased padding for better scroll space
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE || '#F7F7F7',
  },
  inputGroup: {
    marginBottom: 24, // Increased spacing for better separation
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK || '#2D3748',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: COLORS.WHITE || '#FFFFFF',
    borderRadius: 12, // Smoother corners
    padding: 14,
    fontSize: 16,
    color: COLORS.BLACK || '#1A1A1A',
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY || '#E8ECEF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledInput: {
    backgroundColor: COLORS.DISABLED || '#F1F5F9',
    color: COLORS.DISABLED_TEXT || '#6B7280',
    opacity: 0.7,
  },
  multilineInput: {
    height: 120, // Slightly taller for better usability
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  imagePicker: {
    borderRadius: 12,
    backgroundColor: COLORS.WHITE || '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY || '#E8ECEF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8, // Modern gap for spacing
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  imagePickerText: {
    color: COLORS.SECONDARY || '#4B5563',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  imagePreview: {
    width: 120, // Slightly larger for better visibility
    height: 120,
    borderRadius: 12,
    resizeMode: 'cover', // Changed to cover for better image fit
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY || '#E8ECEF',
  },
  bannerPreview: {
    width: SCREEN_WIDTH - 64, // Responsive width
    height: (SCREEN_WIDTH - 64) / 4, // Maintain 4:1 aspect ratio
    borderRadius: 12,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY || '#E8ECEF',
  },
  documentPreview: {
    width: 160,
    height: 100,
    borderRadius: 12,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY || '#E8ECEF',
  },
  documentItem: {
    position: 'relative',
    margin: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.WHITE || '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  documentTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  documentTypeButton: {
    backgroundColor: COLORS.WHITE || '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY || '#E8ECEF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  documentTypeButtonSelected: {
    backgroundColor: COLORS.PRIMARY || '#00C853',
    borderColor: COLORS.PRIMARY || '#00C853',
  },
  documentTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.BLACK || '#1A1A1A',
  },
  paymentMethodsContainer: {
    marginTop: 12,
    gap: 12,
  },
  paymentMethodItem: {
    marginBottom: 12,
  },
  paymentMethodButton: {
    backgroundColor: COLORS.WHITE || '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY || '#E8ECEF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentMethodButtonSelected: {
    backgroundColor: COLORS.PRIMARY || '#00C853',
    borderColor: COLORS.PRIMARY || '#00C853',
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.BLACK || '#1A1A1A',
  },
  accountNumberInput: {
    marginTop: 8,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: COLORS.PRIMARY || '#00C853',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 24,
  },
  deleteButtonFull: {
    backgroundColor: COLORS.ERROR || '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 12,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.DISABLED || '#A0A0A0',
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: COLORS.WHITE || '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});

export default styles;
