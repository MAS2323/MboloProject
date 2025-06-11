import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, ICONS} from '../../../constants';
import styles from './styles/BusinessInfoStyle';
import SCREENS from '../../../screens';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};

const BusinessInfoScreen = () => {
  const navigation = useNavigation();

  // Declarar los iconos
  const ChevronLeftIcon = IconComponents[ICONS.CHEVRON_LEFT.library];
  const ChevronRightIcon = IconComponents[ICONS.CHEVRON_RIGHT.library];

  const menuItems = [
    {
      label: 'Nombre de la empresa, descripción y enlaces',
      onPress: () => navigation.navigate(SCREENS.COMPANY_DETAILS),
    },
    {
      label: 'Dirección de la tienda y horarios comerciales',
      onPress: () => navigation.navigate(SCREENS.STORE_DETAILS),
    },
    {
      label: 'Entrega',
      onPress: () => navigation.navigate(SCREENS.DELIVERY_SCREEN),
    },
  ];

  const renderMenuItem = (label, onPress) => (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <Text style={styles.menuText}>{label}</Text>
      <ChevronRightIcon
        name={ICONS.CHEVRON_RIGHT.name}
        size={ICONS.CHEVRON_RIGHT.size}
        color={COLORS.gray}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeftIcon
            name={ICONS.CHEVRON_LEFT.name}
            size={ICONS.CHEVRON_LEFT.size}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Detalles del negocio</Text>
      </View>

      {menuItems.map((item, index) => (
        <View key={index}>{renderMenuItem(item.label, item.onPress)}</View>
      ))}
    </SafeAreaView>
  );
};

export default BusinessInfoScreen;
