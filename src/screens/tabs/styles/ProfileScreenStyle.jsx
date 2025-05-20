import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loginPromptText: {
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginBtnText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    zIndex: 1,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    textTransform: 'uppercase',
  },
  menuWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  menuItem: {
    flex: 1,
    margin: 10,
    minWidth: 150, // Ancho mínimo para cada elemento
  },
  menuItemInner: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: COLORS.black,
  },
});

export default styles;
