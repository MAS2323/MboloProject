import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {COLORS, ICONS} from '../../../constants';
import SCREENS from '../../../screens';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};

export default function CompanyDetailsScreen() {
  const navigation = useNavigation();
  const menuItems = [
    {
      label: 'Crear una tienda',
      screen: SCREENS.CREAR_TIENDA,
    },
    {
      label: 'Crear una cuenta profesional',
      screen: SCREENS.CREATE_PROFESIONAL_ACCOUNT,
    },
  ];

  const renderMenuItem = (label, screen) => {
    const ChevronRightIcon = IconComponents[ICONS.CHEVRON_RIGHT.library];
    return (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate(screen)}>
        <Text style={styles.menuText}>{label}</Text>
        <ChevronRightIcon
          name={ICONS.CHEVRON_RIGHT.name}
          size={ICONS.CHEVRON_RIGHT.size}
          color={COLORS.gray}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {(() => {
            const ChevronLeftIcon = IconComponents[ICONS.CHEVRON_LEFT.library];
            return (
              <ChevronLeftIcon
                name={ICONS.CHEVRON_LEFT.name}
                size={ICONS.CHEVRON_LEFT.size}
                color={COLORS.green}
              />
            );
          })()}
        </TouchableOpacity>
        <Text style={styles.headerText}>Opciones de Negocio</Text>
      </View>

      {menuItems.map((item, index) => (
        <View key={index}>{renderMenuItem(item.label, item.screen)}</View>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
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
    borderBottomColor: COLORS.lightGray,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.black,
  },
});
