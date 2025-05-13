// screens/HomeScreen.js
import React from 'react';
import {View, FlatList, StatusBar} from 'react-native';
import Header from '../../components/header/Header';
import HeaderSearch from '../../components/header/HeaderSearch';
import MenuScreen from '../../components/menu/MenuScreen';
import styles from './styles/HomeScreen.styles';

const HomeScreen = () => {
  // Componentes que se desplazarán (excepto el header)
  const scrollComponents = [
    {id: '2', component: <HeaderSearch />},
    {id: '3', component: <MenuScreen />},
    // Puedes añadir más componentes aquí
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header fijo */}
      <View style={styles.fixedHeader}>
        <Header />
      </View>

      {/* Contenido desplazable */}
      <FlatList
        data={scrollComponents}
        renderItem={({item}) => item.component}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={<View style={styles.headerSpacer} />}
      />
    </View>
  );
};

export default HomeScreen;
