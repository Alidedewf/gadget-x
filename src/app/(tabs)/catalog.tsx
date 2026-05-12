import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { MOCK_PRODUCTS, MOCK_PHONE_MODELS } from '@/api/mocks/products';
import { useStore } from '@/store/useStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ProductCard } from '@/components/ProductCard';
import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, XCircle } from 'lucide-react-native';

type SortMode = 'default' | 'price_asc' | 'price_desc' | 'rating' | 'discount';

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'default', label: 'Популярные' },
  { key: 'price_asc', label: 'Дешевле' },
  { key: 'price_desc', label: 'Дороже' },
  { key: 'rating', label: 'По рейтингу' },
  { key: 'discount', label: 'Скидки' },
];

export default function CatalogScreen() {
  const { selectedPhoneModelId, setSelectedPhoneModelId } = useStore();
  const { c, theme } = useAppTheme();
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('default');

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS;

    // Фильтр по выбранному устройству
    if (selectedPhoneModelId) {
      result = result.filter(p => p.isUniversal || p.compatibleModels.includes(selectedPhoneModelId));
    }

    // Фильтр по поисковому запросу - применяем только если запрос не пустой
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Сортировка
    result = [...result].sort((a, b) => {
      if (sortMode === 'price_asc') return a.price - b.price;
      if (sortMode === 'price_desc') return b.price - a.price;
      if (sortMode === 'rating') return b.rating - a.rating;
      if (sortMode === 'discount') {
        const discA = a.oldPrice ? a.oldPrice - a.price : 0;
        const discB = b.oldPrice ? b.oldPrice - b.price : 0;
        return discB - discA;
      }
      return 0;
    });

    return result;
  }, [selectedPhoneModelId, query, sortMode]);

  // ⚠️ КРИТИЧНО: stickyHeader — это JSX-переменная, а НЕ компонент.
  // Если объявить как const StickyHeader = () => (...) и вызвать как <StickyHeader />,
  // то при каждом нажатии клавиши React пересоздаёт компонент → TextInput теряет фокус → клавиатура закрывается
  const stickyHeader = (
    <View style={[styles.stickyHeader, { backgroundColor: c.background }]}>
      {/* Поисковая строка */}
      <View style={[styles.searchBar, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Search color={c.textMuted} size={18} />
        <TextInput
          style={[styles.searchInput, { color: c.text }]}
          placeholder="Чехол, кабель, iPhone 15..."
          placeholderTextColor={c.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <XCircle color={c.textMuted} size={18} />
          </TouchableOpacity>
        )}
      </View>

      {/* Выбор устройства */}
      <FlatList
        data={MOCK_PHONE_MODELS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        style={styles.modelsRow}
        contentContainerStyle={{ paddingHorizontal: 0 }}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedPhoneModelId;
          return (
            <TouchableOpacity
              style={[styles.modelBadge, {
                backgroundColor: isSelected ? c.primary : c.surface,
                borderColor: isSelected ? c.primary : c.border
              }]}
              onPress={() => setSelectedPhoneModelId(isSelected ? null : item.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.modelText, { color: isSelected ? '#fff' : c.text }]}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Строка сортировки */}
      <FlatList
        data={SORT_OPTIONS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        style={styles.sortRow}
        renderItem={({ item }) => {
          const isActive = sortMode === item.key;
          return (
            <TouchableOpacity
              style={[styles.sortPill, {
                backgroundColor: isActive ? c.primary : 'transparent',
                borderColor: isActive ? c.primary : c.border
              }]}
              onPress={() => setSortMode(item.key)}
              activeOpacity={0.8}
            >
              {isActive && <ArrowUpDown size={12} color="#fff" />}
              <Text style={[styles.sortText, { color: isActive ? '#fff' : c.textMuted }]}>{item.label}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Результат */}
      <View style={styles.resultRow}>
        <Text style={[styles.resultText, { color: c.textMuted }]}>
          {query.trim() 
            ? `"${query}" — ${filteredProducts.length} товаров` 
            : selectedPhoneModelId 
              ? `${filteredProducts.length} товаров совместимо` 
              : `Все товары (${filteredProducts.length})`}
        </Text>
        {(query.trim() || selectedPhoneModelId) && (
          <TouchableOpacity onPress={() => { setQuery(''); setSelectedPhoneModelId(null); }}>
            <Text style={{ color: c.primary, fontWeight: '700', fontSize: 13 }}>Сбросить</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={stickyHeader}
        stickyHeaderIndices={[0]}
        columnWrapperStyle={styles.columnWrapper}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <SlidersHorizontal size={64} color={c.border} style={{ marginBottom: 15 }} />
            <Text style={[styles.emptyTitle, { color: c.text }]}>Ничего не найдено</Text>
            <Text style={[styles.emptySubtitle, { color: c.textMuted }]}>
              Попробуй изменить запрос или сбросить фильтр по устройству
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  stickyHeader: { paddingTop: 15, paddingHorizontal: 15, paddingBottom: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 12, gap: 10, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  modelsRow: { marginBottom: 10 },
  modelBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, justifyContent: 'center', borderWidth: 1 },
  modelText: { fontSize: 13, fontWeight: '600' },
  sortRow: { marginBottom: 10 },
  sortPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, marginRight: 8, borderWidth: 1, gap: 5 },
  sortText: { fontSize: 13, fontWeight: '600' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 2, paddingBottom: 5 },
  resultText: { fontSize: 13, fontWeight: '500' },
  list: { paddingHorizontal: 12, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between', gap: 12 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 10 },
  emptySubtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
