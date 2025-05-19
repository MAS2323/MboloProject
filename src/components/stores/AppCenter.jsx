import {
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {API_BASE_URL} from '../../config/Service.Config';
import styles from './styles/AppCenterStyle';
import {ICONS, COLORS} from '../../constants';
import SCREENS from '../../screens';

// Dynamic IconComponents object
const IconComponents = {
  Feather: require('react-native-vector-icons/Feather').default,
  Ionicons: require('react-native-vector-icons/Ionicons').default,
  AntDesign: require('react-native-vector-icons/AntDesign').default,
  SimpleLineIcons: require('react-native-vector-icons/SimpleLineIcons').default,
  Entypo: require('react-native-vector-icons/Entypo').default,
  MaterialCommunityIcons:
    require('react-native-vector-icons/MaterialCommunityIcons').default,
  Fontisto: require('react-native-vector-icons/Fontisto').default,
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
};

// Default icon config to prevent undefined errors
const DEFAULT_ICON = {
  library: 'Ionicons',
  name: 'star',
  size: 40,
};

// Calculate item width for 4 columns dynamically
const {width: screenWidth} = Dimensions.get('window');
const numColumns = 4;
const itemWidth = (screenWidth - 40 - (numColumns - 1) * 10) / numColumns; // 40 for horizontal padding/margins, 10 for gap between items

const AppCenter = () => {
  // Estados para almacenar los datos de las categorías
  const [entryUtilities, setEntryUtilities] = useState([]);
  const [urbanTransport, setUrbanTransport] = useState([]);
  const [travel, setTravel] = useState([]);
  const [convenienceAndLife, setConvenienceAndLife] = useState([]);
  const [error, setError] = useState(null);
  const [fundServices, setFundServices] = useState([]);
  const [charity, setCharity] = useState([]);
  const [loading, setLoading] = useState(true);
  // Estado para manejar la URL seleccionada (commented out WebView functionality)
  const [selectedApp, setSelectedApp] = useState(null);

  const navigation = useNavigation();

  // Obtener datos del backend al montar el componente
  useEffect(() => {
    const fetchApps = async () => {
      try {
        if (!API_BASE_URL) {
          throw new Error(
            'API_BASE_URL is undefined. Check Service.Config.js.',
          );
        }

        const categories = [
          'Entry Utilities',
          'Urban Transport',
          'Travel',
          'Convenience & Life',
          'Fund Services',
          'Charity',
        ];

        const requests = categories.map(category =>
          axios
            .get(`${API_BASE_URL}/api/apps/${category}`)
            .then(response => response.data)
            .catch(error => {
              if (error.response && error.response.status === 404) {
                return [];
              }
              throw error;
            }),
        );

        const responses = await Promise.all(requests);

        setEntryUtilities(responses[0] || []);
        setUrbanTransport(responses[1] || []);
        setTravel(responses[2] || []);
        setConvenienceAndLife(responses[3] || []);
        setFundServices(responses[4] || []);
        setCharity(responses[5] || []);
      } catch (error) {
        console.error('Error al obtener las apps:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const renderItem = ({item}) => {
    const normalizedUrl = item.url?.startsWith('http')
      ? item.url
      : `https://${item.url}`;
    const webViewData = item.webViewData ?? '';
    const iconKey = item.icon?.toUpperCase();
    console.log('renderItem iconKey:', iconKey, 'item.icon:', item.icon); // Debug log
    const iconConfig = ICONS[iconKey] || ICONS.STAR || DEFAULT_ICON; // Fallback to STAR, then DEFAULT_ICON
    console.log('iconConfig:', iconConfig); // Debug log
    const IconComponent = IconComponents[iconConfig.library];

    if (!IconComponent) {
      console.warn(`Icon library ${iconConfig.library} not found`);
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          const webViewDataString =
            typeof webViewData === 'object'
              ? JSON.stringify(webViewData)
              : webViewData;
          try {
            navigation.navigate(SCREENS.MINI_APP_WEB_VIEWER, {
              webViewData: webViewDataString,
            });
          } catch (error) {
            console.error('Navigation error:', error);
          }
        }}>
        <IconComponent
          name={iconConfig.name}
          size={40}
          color={COLORS?.gray || '#666'}
          style={styles.icon}
        />
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // Commented out WebView rendering (navigation to MiniAppWebView is used instead)
  /*
    if (selectedApp) {
      const injectedJavaScript = `
        window.webViewData = ${JSON.stringify(selectedApp.webViewData)};
        true;
      `;
      const BackIcon = IconComponents[ICONS.BACK_ARROW?.library || DEFAULT_ICON.library];
      return (
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSelectedApp(null)}>
              <BackIcon
                name={ICONS.BACK_ARROW?.name || DEFAULT_ICON.name}
                size={ICONS.BACK_ARROW?.size || DEFAULT_ICON.size}
                color={COLORS?.BLACK || '#000'}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AppCenter</Text>
          </View>
          <WebView
            source={{ uri: selectedApp.url }}
            style={styles.webView}
            injectedJavaScript={injectedJavaScript}
            javaScriptEnabled={true}
            startInLoadingState={true}
            onMessage={(event) => {
              console.log('Message from WebView:', event.nativeEvent.data);
            }}
          />
        </SafeAreaView>
      );
    }
    */

  // Mostrar indicador de carga si está cargando
  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS?.PRIMARY || '#4c86A8'}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Define icon components for header and Home Apps with fallbacks
  const BackIcon =
    IconComponents[ICONS.BACK_ARROW?.library || DEFAULT_ICON.library];
  const StarIcon = IconComponents[ICONS.STAR?.library || DEFAULT_ICON.library];
  const FlightIcon =
    IconComponents[ICONS.FLIGHT?.library || DEFAULT_ICON.library];
  const HotelIcon =
    IconComponents[ICONS.HOTEL?.library || DEFAULT_ICON.library];

  // Mostrar la lista de aplicaciones si no hay ninguna seleccionada
  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header fija */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon
            name={ICONS.BACK_ARROW?.name || DEFAULT_ICON.name}
            size={ICONS.BACK_ARROW?.size || DEFAULT_ICON.size}
            color={COLORS?.BLACK || '#000'}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AppCenter</Text>
      </View>

      {/* Contenido desplazable */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}>
        {/* Sección Home Apps */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Home Apps</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.homeAppsContainer}>
            <StarIcon
              name={ICONS.STAR?.name || DEFAULT_ICON.name}
              size={40}
              color={COLORS?.gray}
              style={styles.homeAppIcon}
            />
            <FlightIcon
              name={ICONS.FLIGHT?.name || DEFAULT_ICON.name}
              size={40}
              color={COLORS?.gray}
              style={styles.homeAppIcon}
            />
            <HotelIcon
              name={ICONS.HOTEL?.name || DEFAULT_ICON.name}
              size={40}
              color={COLORS?.gray}
              style={styles.homeAppIcon}
            />
          </View>
        </View>

        {/* Sección Entry Utilities */}
        {entryUtilities.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Entry Utilities</Text>
            <FlatList
              data={entryUtilities}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        )}

        {/* Sección Urban Transport */}
        {urbanTransport.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Urban Transport</Text>
            <FlatList
              data={urbanTransport}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        )}

        {/* Sección Travel */}
        {travel.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Travel</Text>
            <FlatList
              data={travel}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        )}

        {/* Sección Convenience & Life */}
        {convenienceAndLife.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Convenience & Life</Text>
            <FlatList
              data={convenienceAndLife}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        )}

        {/* Sección Fund Services */}
        {fundServices.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Fund Services</Text>
            <FlatList
              data={fundServices}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        )}

        {/* Sección Charity */}
        {charity.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Charity</Text>
            <FlatList
              data={charity}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        )}

        {/* Texto final */}
        <Text style={styles.footerText}>
          Disfruta de servicios encantadores en MboloApp
        </Text>

        {/* Espacio adicional para evitar que el contenido se corte */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppCenter;
