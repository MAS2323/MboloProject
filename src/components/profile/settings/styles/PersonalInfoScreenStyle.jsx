import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  savedButton: {
    backgroundColor: '#E0F7FA',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  savedButtonText: {
    color: '#00C853',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  editBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  approvedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  approvedText: {
    color: '#00C853',
    fontSize: 14,
    marginLeft: 5,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B0BEC5',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B0BEC5',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  socialMediaSection: {
    marginVertical: 20,
  },
  socialMediaMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  socialMediaText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    marginLeft: 10,
  },
  socialMediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  socialMediaLabel: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#00C853',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
