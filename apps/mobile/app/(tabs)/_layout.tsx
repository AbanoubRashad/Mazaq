import { Tabs } from 'expo-router';
import { useI18n } from '@/i18n';
import { BagIcon, BeanIcon, CupIcon, HomeIcon } from '@/components/icons';
import { c, font } from '@/theme';

export default function TabsLayout() {
  const { t, ar } = useI18n();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.teal800,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: c.line, minHeight: ar ? 64 : 56 },
        tabBarLabelStyle: { ...font('semibold', ar), fontSize: 12, lineHeight: ar ? 20 : 16 },
        tabBarItemStyle: { paddingVertical: 4 },
        sceneStyle: { backgroundColor: c.ground },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t('app.tabs.home'), tabBarIcon: ({ color }) => <HomeIcon color={color as string} /> }}
      />
      <Tabs.Screen
        name="menu"
        options={{ title: t('app.tabs.menu'), tabBarIcon: ({ color }) => <CupIcon color={color as string} /> }}
      />
      <Tabs.Screen
        name="order"
        options={{ title: t('app.tabs.order'), tabBarIcon: ({ color }) => <BagIcon color={color as string} /> }}
      />
      <Tabs.Screen
        name="rewards"
        options={{ title: t('app.tabs.rewards'), tabBarIcon: ({ color }) => <BeanIcon color={color as string} /> }}
      />
    </Tabs>
  );
}
