import { Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { CustomTabBar } from '@/components/ui/custom-tab-bar';
import { NAV_THEME } from '@/lib/theme';

export default function TabsLayout() {
  return (
    <View className="flex-1 bg-background">
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: NAV_THEME.dark.colors.card },
          headerTintColor: NAV_THEME.dark.colors.text,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="home"
          options={{
            title: 'Home',
          }}
        />
        <Stack.Screen
          name="search"
          options={{
            title: 'Search',
          }}
        />
        <Stack.Screen
          name="leaderboard"
          options={{
            title: 'Leaderboard',
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
      </Stack>
      <CustomTabBar />
    </View>
  );
}
