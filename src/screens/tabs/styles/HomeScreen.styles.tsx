// screens/HomeScreen.styles.js
import {Platform, StatusBar, StyleSheet} from 'react-native';
import COLORS from '../../../constants/colors';
export default StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.BG,
    backgroundColor: '#f5f5f5',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Asegura que el header esté por encima de todo
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingTop: 100, // Ajusta según la altura de tu header
    paddingBottom: 20,
  },
  headerSpacer: {
    height: 60, // Altura aproximada del header (ajustar según necesidad)
  },
});
