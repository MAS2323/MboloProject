import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#E6F0FA", // Fondo claro como en la imagen
  },
  header: {
    // backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E4E7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 18,
    color: '#00C853', // Verde como en la imagen
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000', // Texto negro
    flex: 1,
    textAlign: 'center', // Centrar el título
  },
  listContent: {
    paddingTop: 60, // Espacio para el header fijo
    paddingBottom: 20,
  },
  item: {
    // backgroundColor: "#E6F0FA", // Fondo claro
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E4E7', // Línea divisoria
  },
  subcategoryItem: {
    paddingLeft: 40, // Indentación para subcategorías
    backgroundColor: '#F5F7FA', // Fondo ligeramente más claro para subcategorías
  },
  text: {
    fontSize: 16,
    color: '#000', // Texto negro
    fontWeight: '400',
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
});

export default styles;
