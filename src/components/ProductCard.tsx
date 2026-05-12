import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Product } from '../api/mocks/products';
import { useAppTheme } from '../hooks/useAppTheme';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { useStore } from '../store/useStore';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const { c, theme } = useAppTheme();
  const router = useRouter();
  const { favorites, toggleFavorite, addToCart } = useStore();
  const isFavorite = favorites.includes(product.id);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => { scale.value = withSpring(0.97, { damping: 20 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 20 }); };

  const dollarPrice = parseFloat(product.price.toString().replace(/ /g, '')) / 450;
  const dollarOldPrice = product.oldPrice
    ? parseFloat(product.oldPrice.toString().replace(/ /g, '')) / 450
    : null;
  const discountPct = dollarOldPrice
    ? Math.round((1 - dollarPrice / dollarOldPrice) * 100)
    : null;

  const isNew = !discountPct && product.rating >= 4.8 && product.reviewsCount > 300;

  return (
    <Pressable
      onPress={onPress || (() => router.push(`/product/${product.id}`))}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.wrapper}
    >
      <Animated.View style={animatedStyle}>

        {/* ── КАРТИНКА (основной блок карточки) ── */}
        <View style={[
          styles.imageCard,
          theme === 'dark' && { borderWidth: 1, borderColor: c.border }
        ]}>
          <Image source={{ uri: product.image }} style={styles.image} />

          {/* Бейдж: скидка или "Новинка" — левый верхний угол */}
          {discountPct ? (
            <View style={[styles.badge, { backgroundColor: '#ef4444' }]}>
              <Text style={styles.badgeText}>-{discountPct}%</Text>
            </View>
          ) : isNew ? (
            <View style={[styles.badge, { backgroundColor: c.primary }]}>
              <Text style={styles.badgeText}>Новинка</Text>
            </View>
          ) : null}

          {/* Сердечко — правый верхний угол */}
          <TouchableOpacity
            style={[styles.heartBtn, { backgroundColor: theme === 'light' ? '#fff' : '#2e1065' }]}
            onPress={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <Heart
              color={isFavorite ? '#ef4444' : c.textMuted}
              fill={isFavorite ? '#ef4444' : 'transparent'}
              size={16}
            />
          </TouchableOpacity>
        </View>

        {/* ── ИНФО ПОД КАРТИНКОЙ ── */}
        <View style={styles.info}>
          <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>
            {product.title}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: c.primary }]}>
              ${dollarPrice.toFixed(2)}
            </Text>
            {dollarOldPrice && (
              <Text style={[styles.oldPrice, { color: c.textMuted }]}>
                ${dollarOldPrice.toFixed(2)}
              </Text>
            )}
          </View>
        </View>

      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '47%', marginBottom: 20 },

  // Блок с картинкой
  imageCard: {
    borderRadius: 20,
    height: 175,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 20,
  },

  // Бейдж (скидка / новинка) — левый верхний угол
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },

  // Кнопка лайка — правый верхний угол
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  // Инфо под картинкой (вне карточки)
  info: { paddingHorizontal: 2 },
  title: { fontSize: 13, fontWeight: '600', lineHeight: 18, marginBottom: 6 },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: { fontSize: 15, fontWeight: '900' },
  oldPrice: { fontSize: 12, textDecorationLine: 'line-through', marginTop: 1 },
});
