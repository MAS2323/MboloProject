import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuNavContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    minWidth: '100%',
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
  },
  menuItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4c86A8',
  },
  menuItemText: {
    fontSize: 14,
    color: '#666',
  },
  menuItemTextActive: {
    fontSize: 14,
    color: '#4c86A8',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 5,
  },
  tiendaItem: {
    backgroundColor: '#DDF0FF99',
    borderRadius: 8,
    overflow: 'hidden',
    height: 200,
  },
  tiendaBanner: {
    width: '100%',
    height: '70%',
  },
  tiendaInfo: {
    padding: 10,
    height: '30%',
    justifyContent: 'center',
  },
  tiendaNombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tiendaDescripcion: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default styles;
