import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {API_BASE_URL} from '../../../config/Service.Config';
import styles from './styles/MenuItemDetails';
import SCREENS from '../../../screens';

const MenuItemDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id} = route.params || {};
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/menus/${id}`);
        setMenuItem(response.data);
      } catch (err) {
        setError(
          'No se pudieron cargar los detalles del menú. Intente nuevamente.',
        );
        console.error('Error fetching menu details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMenuDetails();
    }
  }, [id]);

  const handleImagePress = index => {
    if (menuItem?.images && menuItem.images.length > 0) {
      navigation.navigate(SCREENS.IMAGE_GALLERY_SCREEN, {
        images: menuItem.images,
        index,
      });
    }
  };

  const renderMainImage = ({item, index}) => (
    <TouchableOpacity onPress={() => handleImagePress(index)}>
      <Image
        source={{uri: item.url || 'https://via.placeholder.com/300'}}
        style={styles.mainImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderSocialMedia = ({item}) => (
    <TouchableOpacity
      style={styles.socialButton}
      onPress={() => Linking.openURL(item.url)}>
      <Text style={styles.socialButtonText}>{item.platform}</Text>
    </TouchableOpacity>
  );

  const renderScheduleItem = ({item, index}) => (
    <Text key={index} style={styles.scheduleText}>
      {item.day}: {item.open} - {item.close}
    </Text>
  );

  const handleViewProfile = () => {
    if (menuItem?.account) {
      navigation.navigate(SCREENS.OFFICIAL_ACCOUNT_PROFILE_SCREEN, {
        accountId: menuItem.account,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loaderText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (error || !menuItem) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'No se encontraron datos.'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchMenuDetails()}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {menuItem.images && menuItem.images.length > 0 ? (
        <View style={styles.carouselContainer}>
          <FlatList
            data={menuItem.images}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderMainImage}
            contentContainerStyle={styles.carouselList}
          />
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {menuItem.images.length} 📷
            </Text>
          </View>
        </View>
      ) : (
        <Image
          source={{uri: 'https://via.placeholder.com/300'}}
          style={styles.mainImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{menuItem.name || 'Menú'}</Text>
        <Text style={styles.price}>Precio no disponible</Text>
        {menuItem.location && (
          <Text style={styles.location}>
            📍 {menuItem.location.city}, {menuItem.location.province}
          </Text>
        )}
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            Linking.openURL(`mailto:${menuItem.contact?.email || ''}`)
          }>
          <Text style={styles.actionButtonText}>📧 Enviar Mensaje</Text>
        </TouchableOpacity>
        {menuItem.contact?.phoneNumber && (
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() =>
              Linking.openURL(`tel:${menuItem.contact.phoneNumber}`)
            }>
            <Text style={styles.actionButtonText}>📞 Llamar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.subtitle}>Detalles</Text>
        {menuItem.location?.city && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ciudad</Text>
            <Text style={styles.detailValue}>{menuItem.location.city}</Text>
          </View>
        )}
        {menuItem.location?.province && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Provincia</Text>
            <Text style={styles.detailValue}>{menuItem.location.province}</Text>
          </View>
        )}
      </View>

      {menuItem.description && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Descripción</Text>
          <Text style={styles.description}>{menuItem.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.subtitle}>Contacto</Text>
        <View style={styles.contactButtons}>
          {menuItem.contact?.whatsapp && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() =>
                Linking.openURL(`https://wa.me/${menuItem.contact.whatsapp}`)
              }>
              <Text style={styles.contactButtonText}>💬 WhatsApp</Text>
            </TouchableOpacity>
          )}
          {menuItem.contact?.website && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => Linking.openURL(menuItem.contact.website)}>
              <Text style={styles.contactButtonText}>🌐 Sitio Web</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {menuItem.socialMedia && menuItem.socialMedia.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Redes Sociales</Text>
          <FlatList
            data={menuItem.socialMedia}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderSocialMedia}
            contentContainerStyle={styles.socialMediaList}
          />
        </View>
      )}

      {menuItem.horario && menuItem.horario.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>🕒 Horarios</Text>
          <FlatList
            data={menuItem.horario}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderScheduleItem}
            contentContainerStyle={styles.scheduleList}
          />
        </View>
      )}

      {menuItem.pdf?.url && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>📄 Menú en PDF</Text>
          <TouchableOpacity
            style={styles.pdfButton}
            onPress={() => Linking.openURL(menuItem.pdf.url)}>
            <Text style={styles.pdfButtonText}>Ver Menú en PDF</Text>
          </TouchableOpacity>
        </View>
      )}

      {menuItem.account && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Cuenta Oficial</Text>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleViewProfile}>
            <Text style={styles.profileButtonText}>
              Ver Perfil de la Cuenta
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default MenuItemDetails;
