import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useStore } from '@/store/useStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Trash2, Plus, Minus, PackageOpen } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { formatPrice } from '@/utils/currency';
import * as Haptics from 'expo-haptics';

export default function CartScreen() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getCartTotal, clearCart } = useStore();
  const { c } = useAppTheme();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: c.background }]}>
        <PackageOpen size={100} color={c.border} style={{ marginBottom: 20 }} />
        <Text style={[styles.emptyTitle, { color: c.text }]}>Ваша корзина пуста</Text>
        <Text style={[styles.emptySubtitle, { color: c.textMuted }]}>
          В каталоге много крутых аксессуаров, которые ждут своего часа.
        </Text>
        <TouchableOpacity 
          style={[styles.catalogButton, { backgroundColor: c.primary }]}
          onPress={() => router.replace('/(tabs)/catalog')}
          activeOpacity={0.8}
        >
          <Text style={styles.catalogButtonText}>Перейти в каталог</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Text style={[styles.header, { color: c.text }]}>Корзина</Text>
      
      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const itemTotal = item.price * item.quantity;
          return (
            <View style={[styles.cartItem, { backgroundColor: c.surface, borderColor: c.border }]}>
              
              <Image source={{ uri: item.image }} style={styles.image} />
              
              <View style={styles.info}>
                <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>{item.title}</Text>
                
                <Text style={[styles.price, { color: c.primary }]}>
                  {formatPrice(itemTotal)}
                </Text>
                
                {/* Controllers: Minus | Quantity | Plus | Trash */}
                <View style={styles.controllerRow}>
                  <View style={[styles.quantityBox, { borderColor: c.border }]}>
                    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); decreaseQuantity(item.id); }} style={styles.qtyBtn}>
                      <Minus size={16} color={c.text} />
                    </TouchableOpacity>
                    <Text style={[styles.qtyText, { color: c.text }]}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); increaseQuantity(item.id); }} style={styles.qtyBtn}>
                      <Plus size={16} color={c.text} />
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); removeFromCart(item.id); }} style={styles.deleteBtn}>
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          );
        }}
      />

      {/* FLOAT CHECKOUT FOOTER */}
      <View style={[styles.footer, { backgroundColor: c.surface, borderTopColor: c.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: c.textMuted }]}>Итого:</Text>
          <Text style={[styles.totalPrice, { color: c.text }]}>{formatPrice(getCartTotal())}</Text>
        </View>
        
        <TouchableOpacity style={[styles.checkoutBtn, { backgroundColor: c.primary }]} onPress={handleCheckout} activeOpacity={0.8}>
          <Text style={styles.checkoutText}>Оформить заказ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { fontSize: 32, fontWeight: '800', marginBottom: 20, paddingHorizontal: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyTitle: { fontSize: 24, fontWeight: '800', marginBottom: 10 },
  emptySubtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  catalogButton: { paddingHorizontal: 35, paddingVertical: 18, borderRadius: 30, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  catalogButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  cartItem: { flexDirection: 'row', borderRadius: 24, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, borderWidth: 1 },
  image: { width: 100, height: 100, resizeMode: 'contain', marginRight: 15, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 16, padding: 5 },
  info: { flex: 1, justifyContent: 'space-between' },
  title: { fontSize: 14, fontWeight: '600', marginBottom: 6, lineHeight: 18 },
  price: { fontSize: 18, fontWeight: '900', marginBottom: 10 },
  controllerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantityBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  qtyBtn: { padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.02)' },
  qtyText: { paddingHorizontal: 15, fontSize: 16, fontWeight: '800' },
  deleteBtn: { padding: 10, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, borderTopWidth: 1, elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  totalLabel: { fontSize: 18, fontWeight: '600' },
  totalPrice: { fontSize: 28, fontWeight: '900' },
  checkoutBtn: { padding: 20, borderRadius: 24, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: '800' }
});
