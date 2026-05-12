import { Tabs } from 'expo-router';
import { Home, Search, Heart, User, Moon, Sun } from 'lucide-react-native';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { TouchableOpacity, Platform } from 'react-native';
import { useStore } from '../../src/store/useStore';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  const { c, theme } = useAppTheme();
  const toggleTheme = useStore(state => state.toggleTheme);

  const ThemeToggle = () => (
    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
      {theme === 'dark' ? <Sun color={c.text} size={24} /> : <Moon color={c.text} size={24} />}
    </TouchableOpacity>
  );

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: c.primary,
      tabBarInactiveTintColor: c.textMuted,
      tabBarStyle: { 
        backgroundColor: c.surface,
        borderTopColor: c.border,
        borderTopWidth: 1,
        elevation: 0,
        height: Platform.OS === 'ios' ? 85 : 65,
        paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        paddingTop: 5,
      },
      headerStyle: { backgroundColor: c.surface },
      headerTitleStyle: { color: c.text },
      headerRight: () => <ThemeToggle />,
    }}>
      <Tabs.Screen name="index" options={{ title: 'Главная', headerShown: false, tabBarIcon: ({ color }) => <Home size={24} color={color} /> }} />
      <Tabs.Screen name="catalog" options={{ title: 'Каталог', tabBarIcon: ({ color }) => <Search size={24} color={color} /> }} />
      <Tabs.Screen name="favorites" options={{ title: 'Избранное', tabBarIcon: ({ color }) => <Heart size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Кабинет', tabBarIcon: ({ color }) => <User size={24} color={color} /> }} />
    </Tabs>
  );
}
