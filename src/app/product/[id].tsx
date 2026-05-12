import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MOCK_PRODUCTS } from '@/api/mocks/products';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ArrowLeft, ShoppingBag, CheckCircle, AlertTriangle, Heart } from 'lucide-react-native';
import { useStore } from '@/store/useStore';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { c, theme } = useAppTheme();
  const addToCart = useStore(state => state.addToCart);
  const { favorites, toggleFavorite } = useStore();
  const isFavorite = favorites.includes(id as string);

  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <Text style={{ color: c.text }}>Товар не найден</Text>
      </View>
    );
  }

  const dollarPrice = (parseFloat(product.price.toString().replace(/\s/g, '')) / 450).toFixed(2);

  // Используем наш корпоративный цвет для фона под фото
  const topBgColor = theme === 'light' ? c.primaryMuted : c.background;

  return (
    <View style={{ flex: 1, backgroundColor: topBgColor }}>
      
      {/* HEADER OVER THE IMAGE */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme === 'light' ? '#000' : '#fff'} size={28} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleFavorite(id as string)} style={styles.favButton}>
          <Heart color={isFavorite ? '#ef4444' : (theme === 'light' ? '#000' : '#fff')} fill={isFavorite ? '#ef4444' : 'transparent'} size={28} />
        </TouchableOpacity>
      </View>

      {/* BIG PRODUCT IMAGE */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: product.image }} style={styles.image} />
      </View>

      {/* BOTTOM SHEET */}
      <View style={[styles.bottomSheet, { backgroundColor: c.surface }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          
          <Text style={[styles.title, { color: c.text }]}>{product.title}</Text>
          <Text style={[styles.description, { color: c.textMuted }]}>
            {product.description}
          </Text>

          {/* Compatibility Hint */}
          <View style={[styles.hintBox, { borderColor: c.border, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
             {product.isUniversal ? <CheckCircle size={20} color={c.success} /> : <AlertTriangle size={20} color="#f59e0b" />}
             <Text style={{ color: c.text, fontSize: 13, fontWeight: '600', flex: 1 }}>
               {product.isUniversal ? 'Универсальный — подходит для всех устройств.' : 'Проверьте совместимость с вашей моделью перед покупкой.'}
             </Text>
          </View>

          {/* BOTTOM ROW (Price + Button) */}
          <View style={styles.actionRow}>
            <Text style={[styles.price, { color: c.text }]}>${dollarPrice}</Text>
            
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: c.primary }]}
              activeOpacity={0.8}
              onPress={() => addToCart(product)}
            >
              <Text style={[styles.addButtonText, { color: '#fff' }]}>В корзину</Text>
              <ShoppingBag color="#fff" size={18} />
            </TouchableOpacity>
          </View>

          {/* RECOMMENDATIONS */}
          <Text style={[styles.recTitle, { color: c.text }]}>С этим часто берут</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -25, paddingHorizontal: 25 }}>
            {MOCK_PRODUCTS.filter(p => p.id !== product.id).map(recommended => (
              <TouchableOpacity
                key={recommended.id}
                style={[styles.recCard, { borderColor: c.border }]}
                onPress={() => router.push(`/product/${recommended.id}`)}
              >
                <Image source={{ uri: recommended.image }} style={styles.recImage} />
                <View style={{ padding: 10 }}>
                  <Text style={[styles.recCardTitle, { color: c.text }]} numberOfLines={2}>{recommended.title}</Text>
                  <Text style={[styles.recPrice, { color: c.text }]}>
                    ${(parseFloat(recommended.price.toString().replace(/\s/g, '')) / 450).toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <View style={{ width: 40 }} />
          </ScrollView>

        </ScrollView>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, left: 15, right: 15, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between' },
  backButton: { padding: 10, borderRadius: 20 },
  favButton: { padding: 10, borderRadius: 20 },
  imageWrapper: { height: '52%', justifyContent: 'center', alignItems: 'center', padding: 20, paddingTop: 40 },
  image: { width: '100%', height: '100%', resizeMode: 'contain' },
  bottomSheet: { flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 15 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 15, lineHeight: 36 },
  description: { fontSize: 16, lineHeight: 24, marginBottom: 20 },
  hintBox: { padding: 15, borderRadius: 12, borderWidth: 1, marginBottom: 30 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  price: { fontSize: 24, fontWeight: '900' },
  addButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 24, gap: 10 },
  addButtonText: { fontSize: 16, fontWeight: '700' },
  recTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  recCard: { width: 130, marginRight: 15, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  recImage: { width: '100%', height: 100, backgroundColor: 'rgba(0,0,0,0.02)', resizeMode: 'cover' },
  recCardTitle: { fontSize: 12, fontWeight: '600', marginBottom: 4, height: 32 },
  recPrice: { fontSize: 14, fontWeight: '900' },
});
