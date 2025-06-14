import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../constants';

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
    borderBottomColor: COLORS.gray || '#D3D3D3',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black || '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white || '#fff',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray || '#D3D3D3',
  },
  addButtonText: {
    fontSize: 16,
    color: COLORS.black || '#333',
    marginLeft: 10,
  },
});

export default styles;
