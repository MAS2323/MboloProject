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
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {COLORS, SIZES} from '../../constants';
import {API_BASE_URL} from '../../config/Service.Config';
import SCREENS from '../../screens';

// Constants for messages
const MESSAGES = {
  ERRORS: {
    PURCHASE_ERROR: 'No se pudo realizar la compra. Intenta de nuevo.',
    INVALID_QUANTITY: 'La cantidad debe ser al menos 1 y no exceder el stock.',
    INVALID_COLOR: 'Por favor, selecciona un color válido.',
    INVALID_SIZE: 'Por favor, selecciona una talla o número de calzado válido.',
    INVALID_PRODUCT: 'Producto no válido.',
  },
  SUCCESS: {
    PURCHASE_SUCCESS: 'Compra realizada con éxito',
  },
};

// Utility to validate MongoDB ObjectId
const isValidObjectId = id => /^[0-9a-fA-F]{24}$/.test(id);

const OrderProcessingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {product, userId} = route.params;
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [totalPrice, setTotalPrice] = useState(product?.price || 0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Update total price when quantity or product changes
  useEffect(() => {
    if (product?.price) {
      setTotalPrice(product.price * quantity);
    }
  }, [product?.price, quantity]);

  // Handler for finalizing purchase
  const handleFinalizePurchase = useCallback(async () => {
    if (!isValidObjectId(userId) || !isValidObjectId(product._id)) {
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

    setIsProcessing(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, {
        userId,
        customerId: userId, // Adjust if customerId is different
        products: [
          {
            productId: product._id,
            quantity,
            color: selectedColor || null,
            talla: selectedSize || null,
          },
        ],
        total: totalPrice,
        payment_status: 'pending',
      });

      Alert.alert('Éxito', MESSAGES.SUCCESS.PURCHASE_SUCCESS);
      navigation.navigate(SCREENS.ORDER_CONFIRMATION, {
        order: response.data.order,
      });
    } catch (error) {
      console.error('Error creating order:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert('Error', MESSAGES.ERRORS.PURCHASE_ERROR);
    } finally {
      setIsProcessing(false);
    }
  }, [
    userId,
    product,
    quantity,
    selectedColor,
    selectedSize,
    totalPrice,
    navigation,
  ]);

  const renderOption = (item, type, selectedValue, setValue) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        selectedValue === item && styles.optionItemSelected,
      ]}
      onPress={() => setValue(item)}>
      <Text style={styles.optionText}>
        {type === 'color' ? item : item.toString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Confirmar Compra</Text>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        {product.images && product.images.length > 0 ? (
          <Image
            source={{
              uri: product.images[0].url || 'https://via.placeholder.com/300',
            }}
            style={styles.productImage}
            resizeMode="contain"
            onError={() =>
              console.error('Failed to load image:', product.images[0].url)
            }
          />
        ) : (
          <Text style={styles.noImageText}>No hay imagen disponible</Text>
        )}
      </View>

      {/* Product Specifications */}
      <View style={styles.detailsContainer}>
        <Text style={styles.subtitle}>{product.title}</Text>
        <Text style={styles.detailText}>
          Precio Unitario: ${product.price.toFixed(2)}
        </Text>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Cantidad:</Text>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={quantity.toString()}
            onChangeText={text => {
              const num = parseInt(text) || 1;
              setQuantity(Math.max(1, Math.min(num, product.stock || 1)));
            }}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() =>
              setQuantity(Math.min(quantity + 1, product.stock || 1))
            }
            style={styles.quantityButton}>
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

        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isProcessing}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmButton, isProcessing && styles.disabledButton]}
          onPress={handleFinalizePurchase}
          disabled={isProcessing}>
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

const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  noImageText: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
  },
  detailText: {
    fontSize: SIZES.body3,
    color: COLORS.black,
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityLabel: {
    fontSize: SIZES.body3,
    color: COLORS.black,
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body3,
    fontWeight: 'bold',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 5,
    width: 50,
    textAlign: 'center',
  },
  selectionContainer: {
    marginVertical: 10,
  },
  selectionLabel: {
    fontSize: SIZES.body3,
    color: COLORS.black,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  optionList: {
    flexGrow: 0,
  },
  optionItem: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    marginRight: 10,
  },
  optionItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightPrimary,
  },
  optionText: {
    fontSize: SIZES.body3,
    color: COLORS.black,
  },
  totalText: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: COLORS.gray,
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body3,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body3,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
};

export default OrderProcessingScreen;
