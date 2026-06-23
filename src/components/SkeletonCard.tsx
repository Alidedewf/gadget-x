import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useAppTheme } from '@/hooks/useAppTheme';

export const SkeletonCard = () => {
  const { c, theme } = useAppTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.7]),
  }));

  const baseColor = theme === 'dark' ? '#1e1b4b' : '#e2e8f0';

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.imageBlock, { backgroundColor: baseColor }, animatedStyle]} />
      <Animated.View style={[styles.titleBlock, { backgroundColor: baseColor }, animatedStyle]} />
      <Animated.View style={[styles.priceBlock, { backgroundColor: baseColor }, animatedStyle]} />
      <Animated.View style={[styles.ratingBlock, { backgroundColor: baseColor }, animatedStyle]} />
    </View>
  );
};

export const SkeletonGrid = ({ count = 6 }: { count?: number }) => (
  <View style={styles.grid}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  wrapper: { width: '47%', marginBottom: 20 },
  imageBlock: { height: 175, borderRadius: 20, marginBottom: 10 },
  titleBlock: { height: 14, borderRadius: 7, width: '80%', marginBottom: 8, marginLeft: 2 },
  priceBlock: { height: 16, borderRadius: 8, width: '50%', marginBottom: 6, marginLeft: 2 },
  ratingBlock: { height: 12, borderRadius: 6, width: '60%', marginLeft: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, paddingHorizontal: 16 },
});
