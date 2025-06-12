import {StyleSheet, Dimensions} from 'react-native';
import {COLORS} from '../../../constants';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: COLORS.offwhite, // Softer background for better contrast
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    // elevation: 5,
    marginTop: 20, // Adjusted for better spacing
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 16, // Increased for better readability
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    paddingVertical: 8, // Larger touch target
    paddingHorizontal: 8,
  },
  headerText: {
    fontSize: 20, // Increased for prominence
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor: COLORS.offwhite,
  },
  inputGroup: {
    marginBottom: 24, // Increased for better separation
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600', // Bolder for emphasis
    color: COLORS.black, // Higher contrast
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 10, // More rounded for modern look
    padding: 14,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 2,
  },
  selectorText: {
    fontSize: 16,
    color: COLORS.black,
    flex: 1,
  },
  inputText: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: COLORS.white,
    color: COLORS.black,
  },
  textArea: {
    height: 120, // Slightly taller for better usability
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  imageSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addImageButton: {
    width: 64, // Slightly larger for better touch target
    height: 64,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightwhite,
    marginRight: 12,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 2,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: COLORS.lightwhite, // Fallback for loading
  },
  imageWrapper: {
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: 6,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 2,
    elevation: 3,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 8,
    lineHeight: 20,
    opacity: 0.8,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.red,
    marginTop: 6,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 24,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray2,
    opacity: 0.6,
  },
  submitButtonText: {
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
  message: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker for better contrast
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60, // Adjusted for better positioning
    paddingRight: 16,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: 160, // Slightly wider for better readability
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden', // Ensures rounded corners are respected
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    letterSpacing: 0.2,
  },
  iconSize: 24, // Defined as a constant for consistency
});

export default styles;
