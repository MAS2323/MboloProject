import {Dimensions, StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../../constants';
const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  image: {
    width: width * 1,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  details: {
    padding: SIZES.small,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  supplier: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    color: '#FF6347',
    marginBottom: 10,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
  IconButton: {
    backgroundColor: '#4c86A8',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 17,
  },
  imageList: {
    marginBottom: 16,
  },
});
export default styles;
