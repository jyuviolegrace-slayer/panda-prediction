import { Tabs } from 'expo-router';
import * as React from 'react';
import { useStore } from '@/lib/store';
import { Icon } from '@/components/ui/icon';
import { HomeIcon, TrophyIcon, UserIcon } from 'lucide-react-native';
import { Image } from 'react-native';
import { NAV_THEME } from '@/lib/theme';

export default function TabsLayout() {
  const { user } = useStore();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: NAV_THEME.dark.colors.card,
          borderTopColor: NAV_THEME.dark.colors.border,
        },
        tabBarActiveTintColor: NAV_THEME.dark.colors.primary,
        tabBarInactiveTintColor: '#888',
        headerStyle: { backgroundColor: NAV_THEME.dark.colors.card },
        headerTintColor: NAV_THEME.dark.colors.text,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon as={HomeIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <Icon as={TrophyIcon} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) =>
            user ? (
              <Image
                source={{ uri: user.avatar }}
                style={{ width: 22, height: 22, borderRadius: 22 }}
              />
            ) : (
              <Icon as={UserIcon} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
