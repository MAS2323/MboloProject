import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {ICONS, COLORS} from '../../../constants';
import SCREENS from '../../../screens';
import styles from './styles/DeliveryDetailsStyle';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  Feather: require('react-native-vector-icons/Feather').default,
  Ionicons: require('react-native-vector-icons/Ionicons').default,
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};

const DeliveryDetails = () => {
  const navigation = useNavigation();

  // Definir los componentes de íconos dinámicamente
  const BackArrowIcon = IconComponents[ICONS.BACK.library || 'Ionicons'];
  const ShareIcon = IconComponents[ICONS.SHARE_OUTLINE.library || 'Ionicons'];
  const AddIcon = IconComponents[ICONS.ADD.library || 'Ionicons'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header mejorado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon
            name={ICONS.ARROW_BACK.name || 'arrow-back'}
            size={ICONS.ARROW_BACK.size || 24}
            color={COLORS.PRIMARY || '#00C853'}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Entrega</Text>
        <TouchableOpacity>
          <ShareIcon
            name={ICONS.SHARE_OUTLINE.name || 'share-outline'}
            size={ICONS.SHARE_OUTLINE.size || 24}
            color={COLORS.BLACK || '#333'}
          />
        </TouchableOpacity>
      </View>

      {/* Botón para agregar opción de entrega */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate(SCREENS.ADD_DELIVERY_OPTION)}>
        <AddIcon
          name={ICONS.ADD.name || 'add'}
          size={ICONS.ADD.size || 20}
          color={COLORS.primary || '#00C853'}
        />
        <Text style={styles.addButtonText}>Agregar opción de entrega</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DeliveryDetails;
