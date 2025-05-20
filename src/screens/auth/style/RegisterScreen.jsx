import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: COLORS.white || '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary || '#4c86A8',
    marginBottom: 30,
  },
  wrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    backgroundColor: COLORS.lightwhite || '#f9f9f9',
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
  },
  textInput: {
    flex: 1,
    color: '#4c86A8',
    fontSize: 16,
    marginLeft: 10,
  },
  errorText: {
    color: COLORS.red || '#ff0000',
    fontSize: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 15,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.primary || '#4c86A8',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: COLORS.gray || '#ccc',
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white || '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginLink: {
    marginTop: 20,
    textAlign: 'center',
    color: COLORS.gray || '#666',
    fontSize: 16,
  },
});

export default styles;
