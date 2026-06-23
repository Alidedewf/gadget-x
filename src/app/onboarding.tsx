import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform , FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '@/store/useStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useState, useRef } from 'react';
import { Smartphone, Zap, Truck } from 'lucide-react-native';

const { width: SCREEN_W } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    Icon: Smartphone,
    title: 'Найди свой аксессуар',
    description: 'Тысячи чехлов, стёкол и зарядок для iPhone и Samsung — с фильтром по твоей модели.',
    gradient: '#7c3aed',
  },
  {
    id: '2',
    Icon: Zap,
    title: 'Подбери под устройство',
    description: 'Умный фильтр покажет только совместимые аксессуары. Никаких ошибок при покупке.',
    gradient: '#6366f1',
  },
  {
    id: '3',
    Icon: Truck,
    title: 'Бесплатная доставка',
    description: 'Доставим бесплатно по всему Казахстану. Оплата картой или наличными при получении.',
    gradient: '#8b5cf6',
  },
];

export default function OnboardingScreen() {
  const { c } = useAppTheme();
  const router = useRouter();
  const { setHasSeenOnboarding } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
      setActiveIndex(activeIndex + 1);
    } else {
      setHasSeenOnboarding();
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    setHasSeenOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: c.textMuted }]}>Пропустить</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        scrollEnabled={true}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
          setActiveIndex(idx);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: SCREEN_W }]}>
            <View style={[styles.iconCircle, { backgroundColor: item.gradient + '20' }]}>
              <View style={[styles.iconInner, { backgroundColor: item.gradient }]}>
                <item.Icon color="#fff" size={48} strokeWidth={1.5} />
              </View>
            </View>
            <Text style={[styles.slideTitle, { color: c.text }]}>{item.title}</Text>
            <Text style={[styles.slideDesc, { color: c.textMuted }]}>{item.description}</Text>
          </View>
        )}
      />

      {/* Dots + Button */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex
                  ? { backgroundColor: c.primary, width: 24 }
                  : { backgroundColor: c.border, width: 8 },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: c.primary }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextBtnText}>
            {activeIndex === SLIDES.length - 1 ? 'Начать' : 'Далее'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 30, right: 20, zIndex: 10, padding: 10 },
  skipText: { fontSize: 15, fontWeight: '600' },

  slide: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  iconCircle: { width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  iconInner: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  slideTitle: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 16 },
  slideDesc: { fontSize: 16, textAlign: 'center', lineHeight: 24 },

  footer: { paddingHorizontal: 30, paddingBottom: Platform.OS === 'ios' ? 50 : 30, alignItems: 'center' },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 30 },
  dot: { height: 8, borderRadius: 4 },
  nextBtn: { width: '100%', padding: 18, borderRadius: 30, alignItems: 'center' },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
