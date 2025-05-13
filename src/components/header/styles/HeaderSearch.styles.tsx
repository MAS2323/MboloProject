// components/header/HeaderSearch.styles.js
import {StyleSheet} from 'react-native';
import {SIZES, COLORS} from '../../../constants';

export default StyleSheet.create({
  container: {
    // backgroundColor: '#f5f5f5',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    backgroundColor: COLORS.offwhite, // Color de fondo gris claro
    alignItems: 'center', // Centrar contenido horizontalmente
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    width: '100%', // Ocupar todo el ancho disponible
  },
  searchIcon: {
    marginRight: SIZES.small,
  },
  input: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: SIZES.medium,
    color: COLORS.black,
    padding: 0, // Eliminar padding interno para mejor alineación
  },
  exploreText: {
    textAlign: 'center',
    marginTop: 7,
    letterSpacing: 4,
    marginBottom: 5,
    color: COLORS.gray,
    fontFamily: 'Montserrat-Medium',
    fontSize: SIZES.medium,
    textTransform: 'uppercase',
  },
});
