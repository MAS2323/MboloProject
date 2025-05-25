import React from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ICONS, COLORS} from '../../../../constants';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  Feather: require('react-native-vector-icons/Feather').default,
  Ionicons: require('react-native-vector-icons/Ionicons').default,
};

const legalFormOptions = [
  {value: 'Empresario individual', display: 'Empresario individual'},
  {value: 'Sociedad Anónima', display: 'Sociedad Anónima'},
  {
    value: 'Sociedad de Responsabilidad Limitada',
    display: 'Sociedad de Responsabilidad Limitada',
  },
  {value: 'Cooperativas', display: 'Cooperativas'},
  {value: 'Sociedad Colectiva', display: 'Sociedad Colectiva'},
  {value: 'Sociedad Comanditaria', display: 'Sociedad Comanditaria'},
];

const LegalFormSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {returnScreen} = route.params || {};

  // Definir el ícono dinámicamente desde las constantes
  const BackIcon = IconComponents[ICONS.BACK.library || 'MaterialIcons'];

  const handleSelectOption = option => {
    navigation.navigate(returnScreen, {
      legalFormValue: option.value,
      legalFormDisplay: option.display,
    });
  };

  const renderOptionItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleSelectOption(item)}>
      <Text style={styles.itemText}>{item.display}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon
            name={ICONS.BACK.name || 'chevron-left'}
            size={ICONS.BACK.size || 30}
            color={COLORS.PRIMARY || '#00C853'}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Seleccionar Forma Jurídica</Text>
      </View>
      <FlatList
        data={legalFormOptions}
        renderItem={renderOptionItem}
        keyExtractor={item => item.value}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.BLACK || '#1A1A1A',
  },
  listContainer: {
    padding: 15,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.BLACK || '#1A1A1A',
  },
});

export default LegalFormSelectionScreen;
