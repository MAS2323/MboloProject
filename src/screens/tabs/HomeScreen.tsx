import {View, FlatList, StatusBar} from 'react-native';
import Header from '../../components/header/Header';
import HeaderSearch from '../../components/header/HeaderSearch';
import MenuScreen from '../../components/menu/MenuScreen';
import styles from './styles/HomeScreen.styles';
import SlideSection from '../../components/products/SlideSecction';
import ProductRow from '../../components/products/ProductRow';

const HomeScreen = (props: {navigation: any}) => {
  const {navigation} = props;

  // Componentes que se desplazarán (excepto el header)
  const scrollComponents = [
    {id: '2', component: <HeaderSearch />},
    {id: '3', component: <MenuScreen navigation={navigation} />},
    {id: '4', component: <SlideSection />},
    {id: '5', component: <ProductRow />}, // Add ProductRow here
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
