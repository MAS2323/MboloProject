import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';
const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.offwhite,
    marginTop: 30,
  },
  contenedorCarga: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.offwhite,
  },
  contenedorError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.offwhite,
  },
  textoError: {
    fontSize: 16,
    color: COLORS.red,
    textAlign: 'center',
  },
  encabezado: {
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTienda: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  datosTienda: {
    flex: 1,
  },
  nombreTienda: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 5,
  },
  propietarioTienda: {
    fontSize: 14,
    color: COLORS.gray,
  },
  estadisticas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  itemEstadistica: {
    alignItems: 'center',
  },
  valorEstadistica: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 3,
  },
  etiquetaEstadistica: {
    fontSize: 12,
    color: COLORS.gray,
  },
  banner: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
    marginVertical: 10,
  },
  contenedorPestañas: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  pestaña: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  pestañaActiva: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  textoPestaña: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '600',
  },
  textoPestañaActiva: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  listaProductos: {
    paddingBottom: 20,
  },
  tarjetaProducto: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    marginHorizontal: 10,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagenProducto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  infoProducto: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tituloProducto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  descripcionProducto: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 8,
  },
  etiquetaNuevo: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  textoEtiquetaNuevo: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  metaProducto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  datosProducto: {
    flex: 1,
  },
  ventasProducto: {
    fontSize: 12,
    color: COLORS.red,
    marginBottom: 4,
  },
  envioRapido: {
    fontSize: 11,
    color: COLORS.green,
  },
  precioProducto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.red,
  },
  valoracionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  textoValoracion: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 4,
  },
  placeholderImage: {
    backgroundColor: COLORS.lightwhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBannerBackground: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  modalLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  modalDetailsContainer: {
    padding: 15,
  },
  tiendaDetails: {
    padding: 10,
  },
  tiendaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 10,
    marginBottom: 5,
  },
  tiendaText: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 22,
  },
});

export default styles;
