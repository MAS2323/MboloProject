import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import HeaderScreen from '../../components/header/HeaderSearch';
import Header from '../../components/header/Header';

const HomeScreen = () => {
  return (
    <View>
      <Header />
      <HeaderScreen />
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
