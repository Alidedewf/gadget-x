import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useStore } from '@/store/useStore';
import { MOCK_USER } from '@/api/mocks/users';
import { Package, Heart, CreditCard, Moon, Bell, ChevronRight, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { c, theme } = useAppTheme();
  const { toggleTheme } = useStore();
  const router = useRouter();

  const renderSettingItem = (icon: any, title: string, rightComponent: any, onPress?: () => void) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: c.border }]} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconBox, { backgroundColor: c.border }]}>
          {icon}
        </View>
        <Text style={[styles.settingTitle, { color: c.text }]}>{title}</Text>
      </View>
      {rightComponent || <ChevronRight color={c.textMuted} size={20} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: c.background }]} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: c.primary }]}>
          <Text style={styles.avatarText}>{MOCK_USER.name[0]}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: c.text }]}>{MOCK_USER.name}</Text>
          <Text style={[styles.userPhone, { color: c.textMuted }]}>{MOCK_USER.phone}</Text>
        </View>
      </View>

      {/* SECTION: ORDERS & ACCOUNT */}
      <Text style={[styles.sectionTitle, { color: c.textMuted }]}>Опции аккаунта</Text>
      <View style={[styles.sectionBlock, { backgroundColor: c.surface, borderColor: c.border }]}>
        {renderSettingItem(<Package color={c.text} size={20} />, "Мои заказы", null, () => router.push('/orders'))}
        {renderSettingItem(<Heart color={c.text} size={20} />, "Избранное", null, () => router.push('/favorites'))}
        {renderSettingItem(<CreditCard color={c.text} size={20} />, "Привязанные карты", null)}
      </View>

      {/* SECTION: SETTINGS */}
      <Text style={[styles.sectionTitle, { color: c.textMuted }]}>Настройки среды</Text>
      <View style={[styles.sectionBlock, { backgroundColor: c.surface, borderColor: c.border }]}>
        {renderSettingItem(
          <Moon color={c.text} size={20} />, 
          "Темная тема", 
          <Switch value={theme === 'dark'} onValueChange={toggleTheme} trackColor={{ false: c.border, true: c.success }} />
        )}
        {renderSettingItem(
          <Bell color={c.text} size={20} />, 
          "Push-уведомления", 
          <Switch value={true} onValueChange={() => {}} trackColor={{ false: c.border, true: c.success }} />
        )}
      </View>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]} activeOpacity={0.8}>
        <LogOut color="#ef4444" size={20} />
        <Text style={styles.logoutText}>Выйти из профиля</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25, paddingTop: 70, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginRight: 20 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  userInfo: { flex: 1 },
  userName: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  userPhone: { fontSize: 16, fontWeight: '500' },
  sectionTitle: { paddingHorizontal: 25, marginBottom: 10, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' },
  sectionBlock: { marginHorizontal: 20, marginBottom: 30, borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1 },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  settingTitle: { fontSize: 16, fontWeight: '600' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, padding: 18, borderRadius: 20, gap: 10, marginTop: 10 },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: '800' }
});
