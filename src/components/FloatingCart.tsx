import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { useAppTheme } from '@/hooks/useAppTheme';

export const FloatingCart = () => {
  const cart = useStore(state => state.cart);
  const getCartTotal = useStore(state => state.getCartTotal);
  const { c, theme } = useAppTheme();
  const router = useRouter();
  const pathname = usePathname();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = getCartTotal().toFixed(2);
  const isCartScreen = pathname === '/cart';

  // Плавная анимация появления снизу
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (totalItems > 0 && !isCartScreen) {
      // Смягчил анимацию (более расслабленная пружина) и она плавно выныривает "из-за" таб-бара
      translateY.value = withSpring(0, { damping: 18, stiffness: 100, mass: 0.8 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(100, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [totalItems, isCartScreen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents={(totalItems === 0 || isCartScreen) ? 'none' : 'auto'}>
      <TouchableOpacity 
        style={[
          styles.capsule, 
          { backgroundColor: c.surface, borderColor: c.border, borderWidth: 1 }
        ]}
        onPress={() => router.push('/cart')}
        activeOpacity={0.9}
      >
        <View style={styles.priceContainer}>
          <Text style={[styles.priceText, { color: c.text }]}>${totalPrice}</Text>
        </View>

        <View style={[styles.iconContainer, { backgroundColor: c.primary }]}>
          <ShoppingBag color="#fff" size={18} />
          
          <View style={[styles.badge, { backgroundColor: '#ef4444', borderColor: c.surface }]}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 105 : 85, // Опустил обратно, так как таб-бар теперь прибит ко дну
    alignSelf: 'center',
    zIndex: 9999,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    minWidth: 150,
  },
  priceContainer: {
    marginRight: 15,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  }
});
