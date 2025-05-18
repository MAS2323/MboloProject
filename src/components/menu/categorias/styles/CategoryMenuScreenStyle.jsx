import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appBarWrapper: {
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#4c86A8', // Fixed comment mismatch (was "Fondo blanco")
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default styles;
