import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {COLORS, SIZES} from '../../constants';

const OrderConfirmationScreen = () => {
  const route = useRoute();
  const {order} = route.params || {};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Order Confirmation</Text>
      {order ? (
        <View style={styles.orderContainer}>
          <Text style={styles.subtitle}>Order ID: {order._id}</Text>
          <Text style={styles.detail}>Total: ${order.total.toFixed(2)}</Text>
          <Text style={styles.detail}>
            Delivery Status: {order.delivery_status}
          </Text>
          <Text style={styles.detail}>
            Payment Status: {order.payment_status}
          </Text>
          {order.paymentReceipt?.url && (
            <View style={styles.receiptContainer}>
              <Text style={styles.subtitle}>Payment Receipt:</Text>
              <Image
                source={{uri: order.paymentReceipt.url}}
                style={styles.receiptImage}
                resizeMode="contain"
              />
            </View>
          )}
          <Text style={styles.detail}>
            Created At: {new Date(order.createdAt).toLocaleString()}
          </Text>
          <Text style={styles.subtitle}>Products:</Text>
          {order.products.map((item, index) => (
            <View key={index} style={styles.productContainer}>
              <Text style={styles.detail}>
                Product: {item.productId?.title || 'Unknown'}
              </Text>
              <Text style={styles.detail}>Quantity: {item.quantity}</Text>
              <Text style={styles.detail}>
                Subtotal: ${item.subtotal.toFixed(2)}
              </Text>
              {item.color && (
                <Text style={styles.detail}>Color: {item.color}</Text>
              )}
              {item.talla && (
                <Text style={styles.detail}>Size: {item.talla}</Text>
              )}
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.errorText}>No order data available</Text>
      )}
    </ScrollView>
  );
};

export default OrderConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  orderContainer: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.black,
    marginVertical: 10,
  },
  detail: {
    fontSize: SIZES.body3,
    color: COLORS.black,
    marginVertical: 5,
  },
  productContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  receiptContainer: {
    marginVertical: 10,
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  errorText: {
    fontSize: SIZES.body3,
    color: COLORS.red,
    textAlign: 'center',
  },
});
