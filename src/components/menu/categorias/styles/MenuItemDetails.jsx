import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  mainImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  infoContainer: {
    marginVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  schedule: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  image: {
    width: 200,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
export default styles;
