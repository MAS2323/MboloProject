import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {COLORS, ICONS} from '../../../constants';

// Dynamic icon loading
const IconComponents = {
  Ionicons: require('react-native-vector-icons/Ionicons').default,
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  MaterialCommunityIcons:
    require('react-native-vector-icons/MaterialCommunityIcons').default,
  Feather: require('react-native-vector-icons/Feather').default,
  AntDesign: require('react-native-vector-icons/AntDesign').default,
  SimpleLineIcons: require('react-native-vector-icons/SimpleLineIcons').default,
  Entypo: require('react-native-vector-icons/Entypo').default,
  Fontisto: require('react-native-vector-icons/Fontisto').default,
  FontAwesome: require('react-native-vector-icons/FontAwesome').default,
};

const AddDeliveryOptionScreen = () => {
  const navigation = useNavigation();
  const [deliveryName, setDeliveryName] = useState('');
  const [daysFrom, setDaysFrom] = useState('');
  const [daysTo, setDaysTo] = useState('');

  // Log ICONS for debugging
  console.log('ICONS:', JSON.stringify(ICONS, null, 2));

  const renderIcon = (iconConfig, defaultColor, defaultSize = 24) => {
    if (!iconConfig || !iconConfig.library || !iconConfig.name) {
      console.warn(`Invalid icon config: ${JSON.stringify(iconConfig)}`);
      return null; // Prevent rendering if config is invalid
    }
    const IconComponent = IconComponents[iconConfig.library];
    if (!IconComponent) {
      console.warn(`Icon library ${iconConfig.library} not found`);
      return null; // Prevent rendering if library is not found
    }
    return (
      <IconComponent
        name={iconConfig.name}
        size={iconConfig.size || defaultSize}
        color={defaultColor}
      />
    );
  };

  const handleSave = () => {
    // Add logic to save the data here
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {renderIcon(ICONS.ARROW_BACK, COLORS?.PRIMARY || '#00C853')}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Opción de Entrega</Text>
        <TouchableOpacity>
          {renderIcon(ICONS.INFO_CIRCLE_OUTLINE, COLORS?.DARK || '#333')}
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Delivery Name */}
        <Text style={styles.label}>Nombra esta entrega *</Text>
        <TextInput
          style={styles.input}
          placeholder="Todos mis productos 1"
          value={deliveryName}
          onChangeText={setDeliveryName}
        />

        {/* Region */}
        <Text style={styles.label}>Región</Text>
        <TouchableOpacity style={styles.selectInput}>
          {renderIcon(ICONS.LOCATION, COLORS?.DARK || '#333', 20)}
          <Text style={styles.selectText}>Selecciona una región</Text>
          {renderIcon(ICONS.CHEVRON_DOWN, COLORS?.DARK || '#333', 20)}
        </TouchableOpacity>

        {/* Delivery Days */}
        <Text style={styles.label}>¿Cuántos días falta para entregar? *</Text>
        <View style={styles.daysContainer}>
          <TextInput
            style={[styles.input, styles.daysInput]}
            placeholder="De"
            value={daysFrom}
            onChangeText={setDaysFrom}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.daysInput]}
            placeholder="A"
            value={daysTo}
            onChangeText={setDaysTo}
            keyboardType="numeric"
          />
        </View>

        {/* Shipping Cost Billing */}
        <Text style={styles.label}>¿Facturar los gastos de envío?</Text>
        <TouchableOpacity style={styles.selectInput}>
          <Text style={styles.selectText}>Selecciona una opción</Text>
          {renderIcon(ICONS.CHEVRON_DOWN, COLORS?.DARK || '#333', 20)}
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddDeliveryOptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS?.WHITE || '#E8F0FE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: COLORS?.WHITE || '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS?.GRAY || '#D3D3D3',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS?.BLACK || '#333',
  },
  form: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    color: COLORS?.BLACK || '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: COLORS?.WHITE || '#fff',
    borderWidth: 1,
    borderColor: COLORS?.GRAY || '#D3D3D3',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS?.WHITE || '#fff',
    borderWidth: 1,
    borderColor: COLORS?.GRAY || '#D3D3D3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    color: COLORS?.GRAY || '#666',
    marginLeft: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  daysInput: {
    width: '48%',
  },
  saveButton: {
    backgroundColor: COLORS?.GRAY || '#D3D3D3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    color: COLORS?.BLACK || '#333',
    fontWeight: 'bold',
  },
});
