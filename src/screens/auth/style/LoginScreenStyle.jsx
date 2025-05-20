import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white || '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mboloContainer: {
    marginBottom: 30, // Increased for better spacing
  },
  mboloText: {
    textAlign: 'center',
    fontSize: 70, // Match original large font size
    fontWeight: '500',
    color: '#4c86A8', // Match original color
  },
  loginContainer: {
    marginBottom: 20,
  },
  text_header: {
    fontSize: 30, // Match original size
    fontWeight: 'bold',
    color: '#4c86A8', // Match original color
    marginBottom: 20,
  },
  wrapper: {
    width: '100%',
    maxWidth: 400, // Limit form width for larger screens
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12, // Match original rounded corners
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    backgroundColor: COLORS.lightwhite || '#f9f9f9', // Match original light background
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24, // Match original icon size
  },
  textInput: {
    flex: 1,
    color: '#4c86A8', // Match original text color
    fontSize: 16,
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.primary || '#4c86A8',
    paddingVertical: 15,
    borderRadius: 12, // Match rounded aesthetic
    alignItems: 'center',
    width: '100%',
    elevation: 2, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
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
    letterSpacing: 1, // Add spacing for "L O G I N"
  },
  registration: {
    marginTop: 20,
    textAlign: 'center',
    color: COLORS.gray || '#666',
    fontSize: 16,
  },
});

export default styles;
