import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { useStore } from '@/store/useStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, CreditCard, Banknote, CheckCircle } from 'lucide-react-native';
import { formatPrice } from '@/utils/currency';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

type PaymentMethod = 'cash' | 'card';

export default function CheckoutScreen() {
  const { cart, getCartTotal, addOrder } = useStore();
  const { c } = useAppTheme();
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isSuccess, setIsSuccess] = useState(false);

  // Анимация успеха
  const successScale = useSharedValue(0);
  const successOpacity = useSharedValue(0);
  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successOpacity.value,
  }));

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const deliveryCost = 0; // Бесплатная доставка для MVP
  const grandTotal = getCartTotal() + deliveryCost;

  const handleConfirm = () => {
    if (!address.trim()) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addOrder(address.trim());
    setIsSuccess(true);

    successOpacity.value = withTiming(1, { duration: 300 });
    successScale.value = withSpring(1, { damping: 12, stiffness: 100 });
  };

  if (isSuccess) {
    return (
      <View style={[styles.successContainer, { backgroundColor: c.background }]}>
        <Animated.View style={[styles.successContent, successAnimatedStyle]}>
          <View style={[styles.successIcon, { backgroundColor: c.success + '20' }]}>
            <CheckCircle size={64} color={c.success} />
          </View>
          <Text style={[styles.successTitle, { color: c.text }]}>Заказ оформлен!</Text>
          <Text style={[styles.successSubtitle, { color: c.textMuted }]}>
            Ваш заказ на сумму {formatPrice(grandTotal)} принят в обработку. Мы свяжемся с вами для подтверждения.
          </Text>
          <TouchableOpacity
            style={[styles.successBtn, { backgroundColor: c.primary }]}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.8}
          >
            <Text style={styles.successBtnText}>На главную</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ordersBtn, { borderColor: c.border }]}
            onPress={() => router.replace('/orders')}
            activeOpacity={0.8}
          >
            <Text style={[styles.ordersBtnText, { color: c.text }]}>Мои заказы</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color={c.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: c.text }]}>Оформление</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Товары */}
        <Text style={[styles.sectionTitle, { color: c.textMuted }]}>ТОВАРЫ ({totalItems})</Text>
        <View style={[styles.section, { backgroundColor: c.surface, borderColor: c.border }]}>
          {cart.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                index < cart.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.border },
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={[styles.itemTitle, { color: c.text }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.itemMeta, { color: c.textMuted }]}>{item.quantity} шт.</Text>
              </View>
              <Text style={[styles.itemPrice, { color: c.text }]}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Адрес */}
        <Text style={[styles.sectionTitle, { color: c.textMuted }]}>АДРЕС ДОСТАВКИ</Text>
        <View style={[styles.section, { backgroundColor: c.surface, borderColor: c.border }]}>
          <View style={styles.addressRow}>
            <MapPin size={20} color={c.primary} />
            <TextInput
              style={[styles.addressInput, { color: c.text }]}
              placeholder="Город, улица, дом, квартира"
              placeholderTextColor={c.textMuted}
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>
        </View>

        {/* Способ оплаты */}
        <Text style={[styles.sectionTitle, { color: c.textMuted }]}>СПОСОБ ОПЛАТЫ</Text>
        <View style={[styles.section, { backgroundColor: c.surface, borderColor: c.border }]}>
          <TouchableOpacity
            style={[styles.paymentRow, paymentMethod === 'card' && { backgroundColor: c.primary + '15' }]}
            onPress={() => setPaymentMethod('card')}
          >
            <CreditCard size={20} color={paymentMethod === 'card' ? c.primary : c.textMuted} />
            <Text style={[styles.paymentText, { color: c.text }]}>Картой онлайн</Text>
            <View style={[styles.radio, { borderColor: paymentMethod === 'card' ? c.primary : c.border }]}>
              {paymentMethod === 'card' && <View style={[styles.radioInner, { backgroundColor: c.primary }]} />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentRow, paymentMethod === 'cash' && { backgroundColor: c.primary + '15' }]}
            onPress={() => setPaymentMethod('cash')}
          >
            <Banknote size={20} color={paymentMethod === 'cash' ? c.primary : c.textMuted} />
            <Text style={[styles.paymentText, { color: c.text }]}>Наличными курьеру</Text>
            <View style={[styles.radio, { borderColor: paymentMethod === 'cash' ? c.primary : c.border }]}>
              {paymentMethod === 'cash' && <View style={[styles.radioInner, { backgroundColor: c.primary }]} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Итого */}
        <Text style={[styles.sectionTitle, { color: c.textMuted }]}>ИТОГО</Text>
        <View style={[styles.section, { backgroundColor: c.surface, borderColor: c.border }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: c.textMuted }]}>Товары ({totalItems})</Text>
            <Text style={[styles.summaryValue, { color: c.text }]}>{formatPrice(getCartTotal())}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: c.textMuted }]}>Доставка</Text>
            <Text style={[styles.summaryValue, { color: c.success }]}>Бесплатно</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={[styles.summaryTotalLabel, { color: c.text }]}>К оплате</Text>
            <Text style={[styles.summaryTotalValue, { color: c.text }]}>{formatPrice(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Кнопка подтверждения */}
      <View style={[styles.footer, { backgroundColor: c.surface, borderTopColor: c.border }]}>
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            { backgroundColor: address.trim() ? c.primary : c.border },
          ]}
          onPress={handleConfirm}
          disabled={!address.trim()}
          activeOpacity={0.8}
        >
          <Text style={[styles.confirmText, { color: address.trim() ? '#fff' : c.textMuted }]}>
            Подтвердить заказ · {formatPrice(grandTotal)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 60 : 20, paddingBottom: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  scroll: { flex: 1, paddingHorizontal: 16 },

  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 10, marginTop: 20, paddingHorizontal: 4 },
  section: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 4 },

  // Товары
  itemRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  itemImage: { width: 50, height: 50, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.02)' },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  itemMeta: { fontSize: 12, fontWeight: '500' },
  itemPrice: { fontSize: 14, fontWeight: '800' },

  // Адрес
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 12 },
  addressInput: { flex: 1, fontSize: 15, padding: 0, minHeight: 40 },

  // Оплата
  paymentRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  paymentText: { flex: 1, fontSize: 15, fontWeight: '600' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },

  // Итого
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  summaryLabel: { fontSize: 14, fontWeight: '500' },
  summaryValue: { fontSize: 14, fontWeight: '700' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', marginTop: 4, paddingTop: 14 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '800' },
  summaryTotalValue: { fontSize: 18, fontWeight: '900' },

  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 40 : 20, borderTopWidth: 1 },
  confirmBtn: { padding: 18, borderRadius: 24, alignItems: 'center' },
  confirmText: { fontSize: 16, fontWeight: '800' },

  // Успех
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  successContent: { alignItems: 'center' },
  successIcon: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  successTitle: { fontSize: 28, fontWeight: '900', marginBottom: 12 },
  successSubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  successBtn: { paddingHorizontal: 40, paddingVertical: 18, borderRadius: 30, marginBottom: 16, width: '100%', alignItems: 'center' },
  successBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  ordersBtn: { paddingHorizontal: 40, paddingVertical: 16, borderRadius: 30, borderWidth: 1, width: '100%', alignItems: 'center' },
  ordersBtnText: { fontSize: 16, fontWeight: '700' },
});
