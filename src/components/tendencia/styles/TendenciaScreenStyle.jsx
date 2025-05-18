import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 0,
    marginHorizontal: 0,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  price: {
    fontSize: 16,
    color: '#FF6347',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  whatsappText: {
    color: '#fff',
    fontSize: 14,
  },
  title: {
    textAlign: 'left',
    marginTop: 7,
    letterSpacing: 4,
    marginBottom: 5,
    color: 'gray',
    fontSize: 20,
  },
  callIcon: {
    color: '#4c86A8',
    borderWidth: 1,
    borderColor: '#4c86A8',
    borderRadius: 50,
    padding: 4,
    marginRight: 5,
  },
  IconButton: {
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default styles;
