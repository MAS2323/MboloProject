import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SCREENS from '..';

const IntroScreen = props => {
  const {navigation} = props;
  return (
    <View style={styles.container}>
      <Text>IntroScreen</Text>
      <Button
        title="Go to Login"
        onPress={() => {
          // Aquí puedes navegar a la pantalla de inicio de sesión
          navigation.navigate(SCREENS.LOGIN);
        }}
      />
    </View>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
