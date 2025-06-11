import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView, // Using SafeAreaView from react-native
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import styles from './styles/MisPedidosStyles';
import {COLORS} from '../../constants';

const MisPedidosScreen = () => {
  const navigation = useNavigation(); // Replaced useRouter with useNavigation

  // Datos simulados de pedidos (sin cambios)
  const pedidos = [
    {
      id: 'PED001',
      fecha: '15 de abril de 2025',
      estado: 'Entregado',
      total: 150.0,
      items: [
        {nombre: 'Producto 1', cantidad: 2},
        {nombre: 'Producto 2', cantidad: 1},
      ],
    },
    {
      id: 'PED002',
      fecha: '10 de abril de 2025',
      estado: 'En tránsito',
      total: 89.99,
      items: [{nombre: 'Producto 3', cantidad: 1}],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={30}
            color={COLORS.black}
          />
        </TouchableOpacity>
      </View>

      {/* Lista de pedidos */}
      <ScrollView style={styles.content}>
        {pedidos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes pedidos realizados</Text>
          </View>
        ) : (
          pedidos.map(pedido => (
            <View key={pedido.id} style={styles.pedidoCard}>
              <View style={styles.pedidoHeader}>
                <Text style={styles.pedidoId}>Pedido #{pedido.id}</Text>
                <Text
                  style={[
                    styles.estado,
                    pedido.estado === 'Entregado'
                      ? styles.estadoEntregado
                      : styles.estadoEnTransito,
                  ]}>
                  {pedido.estado}
                </Text>
              </View>
              <Text style={styles.fecha}>Fecha: {pedido.fecha}</Text>
              <Text style={styles.total}>
                Total: ${pedido.total.toFixed(2)}
              </Text>
              <View style={styles.itemsContainer}>
                <Text style={styles.itemsTitle}>Artículos:</Text>
                {pedido.items.map((item, index) => (
                  <Text key={index} style={styles.item}>
                    - {item.nombre} (Cant.: {item.cantidad})
                  </Text>
                ))}
              </View>
              <TouchableOpacity style={styles.verDetallesButton}>
                <Text style={styles.verDetallesText}>Ver detalles</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MisPedidosScreen;
