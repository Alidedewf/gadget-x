import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MOCK_PRODUCTS } from '@/api/mocks/products';
import { useStore } from '@/store/useStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ProductCard } from '@/components/ProductCard';
import { Heart } from 'lucide-react-native';

export default function FavoritesScreen() {
  const { favorites } = useStore();
  const { c } = useAppTheme();

  const favoriteProducts = MOCK_PRODUCTS.filter(product => favorites.includes(product.id));

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Text style={[styles.header, { color: c.text }]}>Избранное</Text>

      {favoriteProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Heart size={80} color={c.border} style={{ marginBottom: 20 }} />
          <Text style={[styles.emptyTitle, { color: c.text }]}>Пока пусто</Text>
          <Text style={[styles.emptySubtitle, { color: c.textMuted }]}>
            Добавляйте сюда товары из каталога, чтобы не потерять их из виду
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 15 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 25, paddingHorizontal: 16 },
  list: { paddingHorizontal: 12, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between', gap: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, marginTop: 50 },
  emptyTitle: { fontSize: 24, fontWeight: '800', marginBottom: 10 },
  emptySubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
});
