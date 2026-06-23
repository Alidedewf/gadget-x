import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions, RefreshControl } from 'react-native';
import { MOCK_PRODUCTS } from '@/api/mocks/products';
import { MOCK_USER } from '@/api/mocks/users';
import { ProductCard } from '@/components/ProductCard';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useStore } from '@/store/useStore';
import { Search, ShoppingBag, Zap, Shield, Smartphone, Tag } from 'lucide-react-native';
import { useRouter, Redirect } from 'expo-router';


const { width: SCREEN_W } = Dimensions.get('window');

// ── Баннеры ─────────────────────────
const BANNERS = [
  {
    id: '1',
    title: 'Флэш-продажа\n до 50% скидки',
    subtitle: 'Лучшие чехлы для iPhone 15',
    cta: 'Смотреть',
    bg: '#7c3aed',
    Icon: Smartphone,
  },
  {
    id: '2',
    title: 'MagSafe\nАксессуары',
    subtitle: 'Беспроводная зарядка 3-в-1',
    cta: 'В каталог',
    bg: '#0f172a',
    Icon: Zap,
  },
  {
    id: '3',
    title: 'Защита\nАнти-шпион',
    subtitle: 'Стёкла Privacy Glass нового поколения',
    cta: 'Выбрать',
    bg: '#1e1b4b',
    Icon: Shield,
  },
];

// ── Категории ──────────────────────
const CATEGORIES = [
  'Все',
  'Чехлы',
  'Зарядки',
  'Наушники',
  'Кабели',
  'Защитные стёкла',
  'Подставки и держатели',
  'Умные аксессуары',
];

export default function HomeScreen() {
  const { c } = useAppTheme();
  const router = useRouter();
  const { hasSeenOnboarding } = useStore();
  const [activeCategory, setActiveCategory] = useState('Все');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const bannerRef = useRef<FlatList>(null);

  // Онбординг при первом запуске
  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }


  // Имитация загрузки для скелетонов
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  // Автопрокрутка баннера каждые 3.5 секунды
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex(prev => {
        const next = (prev + 1) % BANNERS.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true, viewOffset: 16 });
        return next;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Фильтруем товары по категории
  const allFiltered = activeCategory === 'Все'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

  // Популярные — топ по рейтингу
  const popular = [...allFiltered].sort((a, b) => b.rating - a.rating).slice(0, 6);

  // Со скидкой — только те у кого есть oldPrice
  const discounted = allFiltered.filter(p => p.oldPrice).slice(0, 6);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={c.primary}
          colors={[c.primary]}
        />
      }
    >
      {/* ── ШАПКА ── */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: c.text }]}>Привет, {MOCK_USER.name}</Text>
          <Text style={[styles.subGreeting, { color: c.textMuted }]}>Найди лучший аксессуар</Text>
        </View>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: c.surface, borderColor: c.border }]}
          onPress={() => router.push('/cart')}
        >
          <ShoppingBag color={c.text} size={20} />
        </TouchableOpacity>
      </View>

      {/* ── ПОИСК ── */}
      <TouchableOpacity
        style={[styles.searchBar, { backgroundColor: c.surface, borderColor: c.border }]}
        onPress={() => router.push('/catalog')}
        activeOpacity={0.9}
      >
        <Search color={c.textMuted} size={18} />
        <Text style={[styles.searchText, { color: c.textMuted }]}>Поиск товаров...</Text>
      </TouchableOpacity>

      {/* ── АВТОБАННЕР ── */}
      <View style={styles.bannerSection}>
        <FlatList
          ref={bannerRef}
          data={BANNERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          snapToInterval={SCREEN_W - 48}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 16 }}
          onMomentumScrollEnd={e => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_W - 48));
            setBannerIndex(Math.min(idx, BANNERS.length - 1));
          }}
          renderItem={({ item }) => (
            <View style={[styles.bannerCard, { backgroundColor: item.bg, width: SCREEN_W - 64 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>{item.title}</Text>
                <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                <TouchableOpacity
                  style={styles.bannerBtn}
                  onPress={() => router.push('/catalog')}
                >
                  <Text style={[styles.bannerBtnText, { color: item.bg }]}>{item.cta}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.bannerIconWrap}>
                <item.Icon color="rgba(255,255,255,0.9)" size={60} strokeWidth={1.2} />
              </View>
            </View>
          )}
        />

        {/* Точки-индикаторы */}
        <View style={styles.dotsRow}>
          {BANNERS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === bannerIndex
                  ? { backgroundColor: c.primary, width: 20 }
                  : { backgroundColor: c.border, width: 8 },
              ]}
            />
          ))}
        </View>
      </View>

      {/* ── КАТЕГОРИИ ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catPill,
                isActive
                  ? { backgroundColor: c.primary, borderColor: c.primary }
                  : { backgroundColor: 'transparent', borderColor: c.border }
              ]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.catText, { color: isActive ? '#fff' : c.text }]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── ПОПУЛЯРНЫЕ ── */}
      {isLoading ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: c.text }]}>Популярные</Text>
          </View>
          <SkeletonGrid count={6} />
        </View>
      ) : popular.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: c.text }]}>Популярные</Text>
            <TouchableOpacity onPress={() => router.push('/catalog')}>
              <Text style={[styles.sectionLink, { color: c.primary }]}>Все товары</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {popular.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </View>
        </View>
      )}

      {/* ── СО СКИДКОЙ ── */}
      {!isLoading && discounted.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Tag size={18} color={c.primary} />
              <Text style={[styles.sectionTitle, { color: c.text }]}>Со скидкой</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/catalog')}>
              <Text style={[styles.sectionLink, { color: c.primary }]}>Смотреть все</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {discounted.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </View>
        </View>
      )}

      {/* Заглушка если ничего нет в категории */}
      {popular.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: c.text }]}>Пока пусто</Text>
          <Text style={[styles.emptySubtitle, { color: c.textMuted }]}>
            В категории «{activeCategory}» нет товаров
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Шапка
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 65, marginBottom: 16 },
  greeting: { fontSize: 22, fontWeight: '800' },
  subGreeting: { fontSize: 13, marginTop: 2 },
  iconBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },

  // Поиск
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, paddingHorizontal: 16, height: 50, borderRadius: 16, borderWidth: 1, gap: 10, marginBottom: 20 },
  searchText: { fontSize: 15, flex: 1 },

  // Баннер
  bannerSection: { marginBottom: 24 },
  bannerCard: { borderRadius: 24, padding: 24, flexDirection: 'row', alignItems: 'center', height: 160, marginRight: 12 },
  bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', lineHeight: 28, marginBottom: 6 },
  bannerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 16 },
  bannerBtn: { backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 30 },
  bannerBtnText: { fontSize: 13, fontWeight: '800' },
  bannerIconWrap: { width: 90, height: 90, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 12 },
  dot: { height: 8, borderRadius: 4 },

  // Категории
  catScroll: { marginBottom: 24 },
  catPill: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  catText: { fontSize: 13, fontWeight: '600' },

  // Секции
  section: { paddingHorizontal: 16, marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  sectionLink: { fontSize: 13, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },

  // Заглушка
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  emptySubtitle: { fontSize: 14 },
});
