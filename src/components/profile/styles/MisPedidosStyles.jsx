import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  pedidoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  estado: {
    fontSize: 14,
    fontWeight: '600',
    padding: 5,
    borderRadius: 5,
  },
  estadoEntregado: {
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
  },
  estadoEnTransito: {
    backgroundColor: '#FFF3E0',
    color: '#FF9800',
  },
  fecha: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  total: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 10,
  },
  itemsContainer: {
    marginBottom: 10,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  item: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  verDetallesButton: {
    backgroundColor: '#E8F0FE',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  verDetallesText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});

export default styles;
