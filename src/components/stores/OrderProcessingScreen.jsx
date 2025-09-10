import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  FlatList,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import {COLORS, SIZES} from '../../constants';
import {API_BASE_URL} from '../../config/Service.Config';
import SCREENS from '../../screens';
import styles from './styles/OrderProcessingScreen';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const MESSAGES = {
  ERRORS: {
    PURCHASE_ERROR: 'No se pudo realizar la compra. Intenta de nuevo.',
    INVALID_QUANTITY: 'La cantidad debe ser al menos 1 y no exceder el stock.',
    INVALID_COLOR: 'Por favor, selecciona un color válido.',
    INVALID_SIZE: 'Por favor, selecciona una talla o número de calzado válido.',
    INVALID_PRODUCT: 'Producto no válido.',
    INVALID_IMAGE:
      'Por favor, selecciona una imagen válida para el recibo de pago.',
    INVALID_USER: 'Usuario no válido. Por favor, inicia sesión nuevamente.',
    INVALID_STORE: 'Tienda no válida.',
    NETWORK_ERROR: 'Error de red. Verifica tu conexión e intenta de nuevo.',
    FILE_UPLOAD_ERROR:
      'Error al subir el recibo de pago. Asegúrate de que sea una imagen válida.',
    TOTAL_MISMATCH:
      'El total proporcionado no coincide con el precio del producto.',
    INVALID_PAYMENT_METHOD: 'Por favor, selecciona un método de pago válido.',
    PAYMENT_METHODS_FETCH_ERROR:
      'No se pudieron cargar los métodos de pago. Intenta de nuevo.',
    NO_PAYMENT_METHODS:
      'No hay métodos de pago disponibles. Contacta al vendedor para más información.',
  },
  SUCCESS: {
    PURCHASE_SUCCESS: 'Compra realizada con éxito',
  },
};

const isValidObjectId = id => /^[0-9a-fA-F]{24}$/.test(id);

const OrderProcessingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {product, userId, storeId: routeStoreId} = route.params;
  const storeId = routeStoreId || product?.tienda?._id;
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [totalPrice, setTotalPrice] = useState(product?.price || 0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    console.log('Received userId:', userId, 'Type:', typeof userId);
    console.log(
      'Received routeStoreId:',
      routeStoreId,
      'Type:',
      typeof routeStoreId,
    );
    console.log(
      'Received product.tienda._id:',
      product?.tienda?._id,
      'Type:',
      typeof product?.tienda?._id,
    );
    console.log('Final storeId:', storeId, 'Type:', typeof storeId);
    console.log('Received product:', JSON.stringify(product, null, 2));
    if (!userId || !isValidObjectId(userId)) {
      Alert.alert('Error', MESSAGES.ERRORS.INVALID_USER);
      navigation.goBack();
      return;
    }
    if (!storeId || !isValidObjectId(storeId)) {
      Alert.alert('Error', MESSAGES.ERRORS.INVALID_STORE);
      navigation.goBack();
      return;
    }
  }, [userId, storeId, routeStoreId, product, navigation]);

  useEffect(() => {
    if (product?.price) {
      setTotalPrice(product.price * quantity);
    }
  }, [product?.price, quantity]);

  // Fetch payment methods
  const fetchPaymentMethods = useCallback(async () => {
    setIsLoadingPaymentMethods(true);
    setFetchError(null);
    try {
      console.log(
        'Fetching payment methods from:',
        `${API_BASE_URL}/stores/${storeId}/payment-methods`,
      );
      const response = await axios.get(
        `${API_BASE_URL}/stores/${storeId}/payment-methods`,
        {timeout: 10000},
      );
      console.log('Payment methods response:', response.data);
      setPaymentMethods(response.data || []);
      if (response.data.length === 0) {
        setFetchError(MESSAGES.ERRORS.NO_PAYMENT_METHODS);
        Alert.alert('Advertencia', MESSAGES.ERRORS.NO_PAYMENT_METHODS);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', {
        storeId,
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      let errorMessage = MESSAGES.ERRORS.PAYMENT_METHODS_FETCH_ERROR;
      if (error.response?.status === 404) {
        errorMessage =
          'Tienda no encontrada o sin métodos de pago disponibles.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = MESSAGES.ERRORS.NETWORK_ERROR;
      }
      setFetchError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoadingPaymentMethods(false);
    }
  }, [storeId]);
  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const handleRetryFetch = () => {
    fetchPaymentMethods();
  };

  const checkStock = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/${product._id}`,
      );
      console.log('Stock check response:', response.data);
      if (response.data.stock < quantity) {
        Alert.alert(
          'Error',
          `Stock insuficiente para ${product.title}. Disponible: ${response.data.stock}`,
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking stock:', {
        message: error.message,
        response: error.response?.data,
      });
      Alert.alert('Error', 'No se pudo verificar el stock. Intenta de nuevo.');
      return false;
    }
  }, [product._id, quantity]);

  const handleSelectImage = useCallback(() => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('ImagePicker Error:', response.errorMessage);
          Alert.alert('Error', MESSAGES.ERRORS.FILE_UPLOAD_ERROR);
        } else if (response.assets && response.assets.length > 0) {
          console.log('Selected image:', response.assets[0]);
          if (response.assets[0].fileSize > 40 * 1024 * 1024) {
            Alert.alert('Error', 'La imagen es demasiado grande. Máximo 40MB.');
            return;
          }
          setPaymentReceipt(response.assets[0]);
        }
      },
    );
  }, []);

  const handleFinalizePurchase = useCallback(async () => {
    if (!userId || !isValidObjectId(userId)) {
      Alert.alert('Error', MESSAGES.ERRORS.INVALID_USER);
      return;
    }
    if (!storeId || !isValidObjectId(storeId)) {
      Alert.alert('Error', MESSAGES.ERRORS.INVALID_STORE);
      return;
    }
    if (!isValidObjectId(product._id)) {
      Alert.alert('Error', MESSAGES.ERRORS.INVALID_PRODUCT);
      return;
    }
    if (quantity < 1 || quantity > (product.stock || 1)) {
      Alert.alert('Error', MESSAGES.ERRORS.INVALID_QUANTITY);
      return;
    }
    if (product.colores.length > 0 && !selectedColor) {
      Alert.alert('Error', MESSAGES.ERRORS.INVALID_COLOR);
      return;
    }
    if (
      (product.tallas.length > 0 || product.numeros_calzado.length > 0) &&
      !selectedSize
    ) {
      Alert.alert('Error', MESSAGES.ERRORS.INVALID_SIZE);
      return;
    }
    if (!selectedPaymentMethod) {
      Alert.alert('Error', MESSAGES.ERRORS.INVALID_PAYMENT_METHOD);
      return;
    }

    const hasStock = await checkStock();
    if (!hasStock) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      const orderData = {
        userId,
        customerId: userId,
        storeId,
        products: [
          {
            productId: product._id,
            quantity,
            color: selectedColor || null,
            talla: selectedSize || null,
          },
        ],
        total: totalPrice.toString(),
        payment_status: 'pending',
        paymentMethod: {
          name: selectedPaymentMethod.name,
          accountNumber: selectedPaymentMethod.accountNumber,
        },
      };

      formData.append('data', JSON.stringify(orderData));

      if (paymentReceipt) {
        const fileExtension = paymentReceipt.uri.split('.').pop().toLowerCase();
        const mimeType = `image/${
          fileExtension === 'jpg' || fileExtension === 'jpeg'
            ? 'jpeg'
            : fileExtension
        }`;
        formData.append('paymentReceipt', {
          uri:
            Platform.OS === 'android'
              ? paymentReceipt.uri
              : paymentReceipt.uri.replace('file://', ''),
          type: mimeType,
          name:
            paymentReceipt.fileName || `receipt_${Date.now()}.${fileExtension}`,
        });
      }

      console.log('FormData entries:');
      for (const [key, value] of formData._parts) {
        console.log(
          key,
          ':',
          value.uri ? `[File: ${value.name}, ${value.type}]` : value,
        );
      }

      const response = await axios.post(`${API_BASE_URL}/orders`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        timeout: 30000,
      });

      Alert.alert('Éxito', MESSAGES.SUCCESS.PURCHASE_SUCCESS);
      navigation.navigate(SCREENS.ORDER_CONFIRMATION, {
        order: response.data.order,
      });
    } catch (error) {
      console.error('Error creating order:', {
        message: error.message,
        config: error.config,
        response: {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        },
      });

      const errorMessage =
        error.response?.data?.message ||
        (error.response?.data?.errors
          ? error.response.data.errors.join(', ')
          : error.message === 'timeout of 30000ms exceeded'
          ? MESSAGES.ERRORS.NETWORK_ERROR
          : MESSAGES.ERRORS.PURCHASE_ERROR);

      Alert.alert('Error', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [
    userId,
    storeId,
    product,
    quantity,
    selectedColor,
    selectedSize,
    totalPrice,
    paymentReceipt,
    selectedPaymentMethod,
    navigation,
  ]);

  const handleImageScroll = ({nativeEvent}) => {
    const index = Math.round(nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const renderOption = (item, type, selectedValue, setValue) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        selectedValue === item && styles.optionItemSelected,
      ]}
      onPress={() => setValue(item)}
      disabled={isProcessing}>
      <Text style={styles.optionText}>
        {type === 'color' ? item : item.toString()}
      </Text>
    </TouchableOpacity>
  );

  const renderPaymentMethod = ({item}) => (
    <TouchableOpacity
      style={[
        styles.paymentMethodItem,
        selectedPaymentMethod?.accountNumber === item.accountNumber &&
          styles.optionItemSelected,
      ]}
      onPress={() => setSelectedPaymentMethod(item)}
      disabled={isProcessing}>
      <Image
        source={{uri: item.image.url || 'https://via.placeholder.com/100'}}
        style={styles.paymentMethodImage}
        resizeMode="contain"
        onError={() =>
          console.error('Failed to load payment method image:', item.image.url)
        }
      />
      <View style={styles.paymentMethodDetails}>
        <Text style={styles.paymentMethodText}>{item.name}</Text>
        <Text style={styles.paymentMethodAccount}>{item.accountNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderImage = ({item: image, index}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(SCREENS.IMAGE_GALLERY_SCREEN, {
          images: product.images,
          index,
        })
      }>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: image.url || 'https://via.placeholder.com/300'}}
          style={styles.image}
          resizeMode="cover"
          onError={() => console.error('Failed to load image:', image.url)}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Confirmar Compra</Text>
      <View style={styles.imageSectionContainer}>
        {product.images && product.images.length > 0 ? (
          <>
            <FlatList
              data={product.images}
              renderItem={renderImage}
              keyExtractor={(image, index) => `image-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              onScroll={handleImageScroll}
              scrollEventThrottle={16}
              contentContainerStyle={styles.imageListContent}
            />
            {product.images.length > 1 && (
              <View style={styles.paginationContainer}>
                {product.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentImageIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <Text style={styles.noImageText}>No hay imagen disponible</Text>
        )}
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.subtitle}>{product.title}</Text>
        <Text style={styles.detailText}>
          Precio Unitario: ${product.price.toFixed(2)}
        </Text>
        <Text style={styles.detailText}>
          Stock Disponible: {product.stock || 0}
        </Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Cantidad:</Text>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={[
              styles.quantityButton,
              isProcessing && styles.disabledButton,
            ]}
            disabled={isProcessing}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.quantityInput, isProcessing && styles.disabledInput]}
            value={quantity.toString()}
            onChangeText={text => {
              const num = parseInt(text) || 1;
              setQuantity(Math.max(1, Math.min(num, product.stock || 1)));
            }}
            keyboardType="numeric"
            editable={!isProcessing}
          />
          <TouchableOpacity
            onPress={() =>
              setQuantity(Math.min(quantity + 1, product.stock || 1))
            }
            style={[
              styles.quantityButton,
              isProcessing && styles.disabledButton,
            ]}
            disabled={isProcessing}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {product.colores.length > 0 && (
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionLabel}>Color:</Text>
            <FlatList
              data={product.colores}
              renderItem={({item}) =>
                renderOption(item, 'color', selectedColor, setSelectedColor)
              }
              keyExtractor={item => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.optionList}
            />
          </View>
        )}
        {(product.tallas.length > 0 || product.numeros_calzado.length > 0) && (
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionLabel}>
              {product.tallas.length > 0 ? 'Talla' : 'Número de Calzado'}:
            </Text>
            <FlatList
              data={
                product.tallas.length > 0
                  ? product.tallas
                  : product.numeros_calzado
              }
              renderItem={({item}) =>
                renderOption(item, 'size', selectedSize, setSelectedSize)
              }
              keyExtractor={item => item.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.optionList}
            />
          </View>
        )}
        <View style={styles.selectionContainer}>
          <Text style={styles.selectionLabel}>Método de Pago:</Text>
          {isLoadingPaymentMethods ? (
            <ActivityIndicator size="large" color={COLORS.blue} />
          ) : fetchError ? (
            <View>
              <Text style={styles.noPaymentText}>
                {MESSAGES.ERRORS.NO_PAYMENT_METHODS}
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetryFetch}>
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : paymentMethods.length > 0 ? (
            <FlatList
              data={paymentMethods}
              renderItem={renderPaymentMethod}
              keyExtractor={item => item.accountNumber}
              style={styles.paymentMethodList}
            />
          ) : (
            <Text style={styles.noPaymentText}>
              {MESSAGES.ERRORS.NO_PAYMENT_METHODS}
            </Text>
          )}
        </View>
        <View style={styles.selectionContainer}>
          <Text style={styles.selectionLabel}>Recibo de Pago (Opcional):</Text>
          <TouchableOpacity
            style={[styles.uploadButton, isProcessing && styles.disabledButton]}
            onPress={handleSelectImage}
            disabled={isProcessing}>
            <Text style={styles.uploadButtonText}>
              {paymentReceipt ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
            </Text>
          </TouchableOpacity>
          {paymentReceipt && (
            <Image
              source={{uri: paymentReceipt.uri}}
              style={styles.receiptImage}
              resizeMode="cover"
            />
          )}
        </View>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.cancelButton, isProcessing && styles.disabledButton]}
          onPress={() => navigation.goBack()}
          disabled={isProcessing}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (isProcessing || paymentMethods.length === 0) &&
              styles.disabledButton,
          ]}
          onPress={handleFinalizePurchase}
          disabled={isProcessing || paymentMethods.length === 0}>
          {isProcessing ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.confirmButtonText}>Finalizar Compra</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OrderProcessingScreen;
