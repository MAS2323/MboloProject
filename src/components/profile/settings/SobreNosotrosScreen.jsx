import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS, ICONS} from '../../../constants';

// Header Component
const Header = ({onBack, title}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <MaterialIcons
          name={ICONS.CHEVRON_LEFT.name}
          size={ICONS.CHEVRON_LEFT.size}
          color={COLORS.black}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
      <View style={{width: 30}} />
    </View>
  );
};

const SobreNosotrosScreen = () => {
  const navigation = useNavigation();

  const handleEmailPress = () => {
    Linking.openURL('mailto:masonewe@gmail.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={() => navigation.goBack()} title="Sobre MboloApp" />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiénes Somos</Text>
          <Text style={styles.text}>
            MboloApp es una aplicación desarrollada por un equipo comprometido
            con la innovación tecnológica en Guinea Ecuatorial. Nuestro objetivo
            es proporcionar soluciones digitales que faciliten la vida de los
            ecuatoguineanos.
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestra Misión</Text>
          <Text style={styles.text}>
            Conectar a las personas y negocios en Guinea Ecuatorial a través de
            tecnología accesible y fácil de usar, promoviendo el desarrollo
            económico y social de nuestra comunidad.
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestra Visión</Text>
          <Text style={styles.text}>
            Ser la plataforma digital líder en Guinea Ecuatorial, reconocida por
            su calidad, innovación y contribución al crecimiento del país.
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valores</Text>
          <Text style={styles.text}>
            • Innovación{'\n'}• Compromiso con Guinea Ecuatorial{'\n'}• Calidad
            {'\n'}• Accesibilidad{'\n'}• Responsabilidad social
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          <Text style={styles.text}>
            Para más información, sugerencias o colaboraciones, escríbenos a:
          </Text>
          <Text style={[styles.text, styles.email]} onPress={handleEmailPress}>
            masonewe@gmail.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SobreNosotrosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.headerBackground || COLORS.white,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray || COLORS.separator,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black || COLORS.title,
    textAlign: 'center',
    flex: 1, // Ensures title is centered
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  email: {
    color: COLORS.link,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.separator,
    marginVertical: 10,
  },
});
