import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SCREENS from '..';

const LoginScren = props => {
  return (
    <View style={styles.container}>
      <Text>LoginScren</Text>
      <Button
        title="Go to Home"
        onPress={() => props.navigation.navigate(SCREENS.HOME_STACK)}
      />
    </View>
  );
};

export default LoginScren;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
