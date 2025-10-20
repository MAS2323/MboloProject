import React, {useState} from 'react';
import {View, FlatList, StatusBar, RefreshControl} from 'react-native';
import Header from '../../components/header/Header';
import HeaderSearch from '../../components/header/HeaderSearch';
import MenuScreen from '../../components/menu/MenuScreen';
import SlideSection from '../../components/products/SlideSecction';
import ProductRow from '../../components/products/ProductRow';
import TendenciaScreen from '../../components/tendencia/TendenciaScreen';
import styles from './styles/HomeScreen.styles';
import {COLORS} from '../../constants';

const HomeScreen = props => {
  const {navigation} = props;
  const [refreshing, setRefreshing] = useState(false);

  // Componentes que se desplazarán (excepto el header)
  const scrollComponents = [
    {id: '2', component: <HeaderSearch />},
    {id: '3', component: <MenuScreen />},
    {id: '4', component: <SlideSection />},
    {id: '5', component: <ProductRow />},
    {id: '6', component: <TendenciaScreen />},
  ];

  // Función para manejar el refresh
  const onRefresh = () => {
    setRefreshing(true);
    // Simula una acción de refresco (reemplaza con tu lógica de API)
    setTimeout(() => {
      console.log('Refresh completed');
      setRefreshing(false);
    }, 2000); // Simula 2 segundos de carga
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header fijo */}
      <View style={styles.fixedHeader}>
        <Header />
      </View>

      {/* Contenido desplazable con RefreshControl */}
      <FlatList
        data={scrollComponents}
        renderItem={({item}) => item.component}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={<View style={styles.headerSpacer} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]} // Color del indicador de refresco
            tintColor={COLORS.primary} // Color en iOS
          />
        }
      />
    </View>
  );
};

export default HomeScreen;
