import {Dimensions, StyleSheet} from 'react-native';
const {width: screenWidth} = Dimensions.get('window');
const numColumns = 4;
const itemWidth = (screenWidth - 40 - (numColumns - 1) * 10) / numColumns;
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  sectionContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#4c86A8',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  homeAppsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  homeAppIcon: {
    marginRight: 15,
  },
  flatListContent: {
    alignItems: 'flex-start',
  },
  itemContainer: {
    width: itemWidth,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  icon: {
    marginBottom: 5,
  },
  itemText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  bottomSpacer: {
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webView: {
    flex: 1,
  },
});

export default styles;
