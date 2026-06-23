import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Image } from 'react-native';
import { useStore, Order } from '@/store/useStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useRouter } from 'expo-router';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, ShoppingBag } from 'lucide-react-native';
import { formatPrice } from '@/utils/currency';

const STATUS_CONFIG = {
  processing: { label: 'В обработке', color: '#f59e0b', Icon: Clock },
  shipping: { label: 'В пути', color: '#3b82f6', Icon: Truck },
  delivered: { label: 'Доставлен', color: '#10b981', Icon: CheckCircle },
};

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function OrdersScreen() {
  const { orders } = useStore();
  const { c } = useAppTheme();
  const router = useRouter();

  const renderOrder = ({ item }: { item: Order }) => {
    const statusCfg = STATUS_CONFIG[item.status];
    const StatusIcon = statusCfg.Icon;

    return (
      <View style={[styles.orderCard, { backgroundColor: c.surface, borderColor: c.border }]}>
        {/* Header */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={[styles.orderId, { color: c.textMuted }]}>#{item.id.slice(-6).toUpperCase()}</Text>
            <Text style={[styles.orderDate, { color: c.textMuted }]}>{formatDate(item.date)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.color + '20' }]}>
            <StatusIcon size={14} color={statusCfg.color} />
            <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
          </View>
        </View>

        {/* Items preview */}
        <View style={styles.itemsPreview}>
          {item.items.slice(0, 3).map((cartItem) => (
            <Image key={cartItem.id} source={{ uri: cartItem.image }} style={styles.previewImage} />
          ))}
          {item.items.length > 3 && (
            <View style={[styles.moreItems, { backgroundColor: c.border }]}>
              <Text style={[styles.moreItemsText, { color: c.text }]}>+{item.items.length - 3}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={[styles.orderFooter, { borderTopColor: c.border }]}>
          <Text style={[styles.orderAddress, { color: c.textMuted }]} numberOfLines={1}>📍 {item.address}</Text>
          <Text style={[styles.orderTotal, { color: c.text }]}>{formatPrice(item.total)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color={c.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: c.text }]}>Мои заказы</Text>
        <View style={{ width: 44 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={80} color={c.border} style={{ marginBottom: 20 }} />
          <Text style={[styles.emptyTitle, { color: c.text }]}>Заказов пока нет</Text>
          <Text style={[styles.emptySubtitle, { color: c.textMuted }]}>
            Ваши оформленные заказы будут отображаться здесь
          </Text>
          <TouchableOpacity
            style={[styles.catalogBtn, { backgroundColor: c.primary }]}
            onPress={() => router.replace('/(tabs)/catalog')}
            activeOpacity={0.8}
          >
            <Text style={styles.catalogBtnText}>В каталог</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={renderOrder}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 60 : 20, paddingBottom: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800' },

  // Order card
  orderCard: { borderRadius: 20, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16 },
  orderId: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  orderDate: { fontSize: 12, fontWeight: '500' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },

  // Items preview
  itemsPreview: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  previewImage: { width: 50, height: 50, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.02)' },
  moreItems: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  moreItemsText: { fontSize: 14, fontWeight: '800' },

  // Footer
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1 },
  orderAddress: { fontSize: 13, fontWeight: '500', flex: 1, marginRight: 10 },
  orderTotal: { fontSize: 16, fontWeight: '900' },

  // Empty
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyTitle: { fontSize: 24, fontWeight: '800', marginBottom: 10 },
  emptySubtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  catalogBtn: { paddingHorizontal: 35, paddingVertical: 18, borderRadius: 30 },
  catalogBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
