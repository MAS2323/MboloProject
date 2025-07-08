import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginLeft: 16,
  },
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.black,
    backgroundColor: COLORS.white,
  },
  disabledInput: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.7,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  picker: {
    height: 50,
    color: COLORS.black,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  bannerPreview: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentPreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    fontSize: 14,
    color: COLORS.placeholder,
    marginTop: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 8,
  },
  cardText: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 8,
  },
  paymentMethodsContainer: {
    flexDirection: 'column',
    marginTop: 8,
  },
  paymentMethodButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.white,
  },
  paymentMethodButtonSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  paymentMethodText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '500',
  },
  paymentMethodItem: {
    marginBottom: 8,
  },
  paymentMethodImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginTop: 8,
  },
  accountNumberInput: {
    marginTop: 8,
  },
});

export default styles;
