// screens/HomeScreen.styles.js
import {StatusBar, StyleSheet} from 'react-native';
import COLORS from '../../../constants/colors';
import {SIZES} from '../../../constants';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Asegura que el header esté por encima de todo
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    paddingTop: 100, // Ajusta según la altura de tu header
    paddingBottom: 20,
  },
  headerSpacer: {
    height: 60, // Altura aproximada del header (ajustar según necesidad)
  },
});
