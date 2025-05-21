import {StyleSheet, Text, View, Switch, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {COLORS, ICONS} from '../../../constants';

// Importar los componentes de iconos dinámicamente
const IconComponents = {
  Ionicons: require('react-native-vector-icons/Ionicons').default,
};

const DisableFeedbackScreen = () => {
  const navigation = useNavigation();
  const [isFeedbackEnabled, setIsFeedbackEnabled] = useState(true);

  const handleSave = () => {
    // Aquí puedes agregar la lógica para guardar la configuración
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {(() => {
            const ArrowBackIcon = IconComponents[ICONS.ARROW_BACK.library];
            return (
              <ArrowBackIcon
                name={ICONS.ARROW_BACK.name}
                size={ICONS.ARROW_BACK.size}
                color={COLORS.green}
              />
            );
          })()}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Desactivar Comentarios</Text>
        <TouchableOpacity>
          {(() => {
            const InfoIcon = IconComponents[ICONS.INFO_CIRCLE_OUTLINE.library];
            return (
              <InfoIcon
                name={ICONS.INFO_CIRCLE_OUTLINE.name}
                size={ICONS.INFO_CIRCLE_OUTLINE.size}
                color={COLORS.black}
              />
            );
          })()}
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.description}>
          Puedes desactivar los comentarios si no deseas recibir
          retroalimentación de los usuarios. Esto aplicará a todos tus pedidos y
          servicios.
        </Text>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Permitir comentarios</Text>
          <Switch
            value={isFeedbackEnabled}
            onValueChange={value => setIsFeedbackEnabled(value)}
            trackColor={{false: COLORS.lightGray, true: COLORS.green}}
            thumbColor={isFeedbackEnabled ? COLORS.white : COLORS.white}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DisableFeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  content: {
    padding: 15,
  },
  description: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 20,
    lineHeight: 22,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: 'bold',
  },
});
