import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, ICONS} from '../../constants';
import SCREENS from '../../screens';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};

const CompanyDetailsScreen = () => {
  const navigation = useNavigation();

  // Declarar los iconos
  const ChevronLeftIcon = IconComponents[ICONS.CHEVRON_LEFT.library];
  const ChevronRightIcon = IconComponents[ICONS.CHEVRON_RIGHT.library];

  const menuItems = [
    {
      label: 'Crear una tienda',
      onPress: () => navigation.navigate(SCREENS.CREAR_TIENDA),
    },
    {
      label: 'Crear una cuenta profesional',
      onPress: () => navigation.navigate(SCREENS.CREATE_PROFESIONAL_ACCOUNT),
    },
    // {
    //   label: 'Dirección',
    //   onPress: () => navigation.navigate(SCREENS.DELIVERY_SCREEN),
    // },
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
        <Text style={styles.headerText}>Opciones de Negocio</Text>
      </View>
      {menuItems.map((item, index) => (
        <View key={index}>{renderMenuItem(item.label, item.onPress)}</View>
      ))}
    </SafeAreaView>
  );
};

export default CompanyDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    color: COLORS.black,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuText: {
    fontSize: 16,
    color: COLORS.black,
  },
});
