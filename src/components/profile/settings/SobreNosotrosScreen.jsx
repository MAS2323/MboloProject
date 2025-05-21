import {StyleSheet, Text, View, ScrollView, Linking} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../../../constants';

const SobreNosotrosScreen = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:masonewe@gmail.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Contenido con Scroll */}
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
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 15,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.title,
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
