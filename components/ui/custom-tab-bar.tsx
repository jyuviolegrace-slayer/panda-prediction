import React from 'react';
import { View, Pressable, Platform } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { HomeIcon, SearchIcon, TrendingUpIcon, UserIcon, PlusIcon } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';

interface TabBarProps {
  className?: string;
}

const tabs = [
  { name: 'home', icon: HomeIcon, label: 'Home', route: '/(tabs)/home' },
  { name: 'search', icon: SearchIcon, label: 'Search', route: '/(tabs)/search' },
  { name: 'plus', icon: PlusIcon, label: 'Create', route: '/create-vote' },
  { name: 'leaderboard', icon: TrendingUpIcon, label: 'Leaderboard', route: '/(tabs)/leaderboard' },
  { name: 'profile', icon: UserIcon, label: 'Profile', route: '/(tabs)/profile' },
];

export function CustomTabBar({ className }: TabBarProps) {
  const pathname = usePathname();
  const plusScale = useSharedValue(1);

  const getCurrentTab = () => {
    if (pathname.includes('/home')) return 'home';
    if (pathname.includes('/search')) return 'search';
    if (pathname.includes('/leaderboard')) return 'leaderboard';
    if (pathname.includes('/profile')) return 'profile';
    return 'home';
  };

  const currentTab = getCurrentTab();

  const handleTabPress = (tab: typeof tabs[0]) => {
    if (tab.name === 'plus') {
      // Animate plus button
      plusScale.value = withSpring(0.9, { duration: 100 }, () => {
        plusScale.value = withSpring(1, { duration: 100 });
      });
      console.log('Create new prediction');
      router.push('/create-vote');
    } else {
      router.push(tab.route as any);
    }
  };

  const plusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: plusScale.value }],
  }));

  return (
    <View 
      className={cn(
        'flex-row items-center justify-around bg-[hsl(var(--tab-bar-background))] border-t border-[hsl(var(--border))]',
        className
      )}
      style={{ 
        height: Platform.OS === 'ios' ? 88 : 72,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = currentTab === tab.name;
        const isPlusButton = tab.name === 'plus';
        
        if (isPlusButton) {
          return (
            <Animated.View key={tab.name} style={plusAnimatedStyle}>
              <Pressable
                onPress={() => handleTabPress(tab)}
                className="items-center justify-center w-14 h-14 bg-[hsl(var(--tab-bar-plus-bg))] rounded-full"
                accessibilityLabel={tab.label}
                accessibilityRole="button"
              >
                <Icon 
                  as={tab.icon} 
                  size={24} 
                  color="hsl(var(--tab-bar-plus-fg))" 
                />
              </Pressable>
            </Animated.View>
          );
        }

        return (
          <Pressable
            key={tab.name}
            onPress={() => handleTabPress(tab)}
            className="items-center justify-center flex-1 py-2"
            accessibilityLabel={tab.label}
            accessibilityRole="button"
          >
            <Icon 
              as={tab.icon} 
              size={20} 
              color={isActive ? 'hsl(var(--tab-bar-active))' : 'hsl(var(--tab-bar-inactive))'} 
            />
            <Text 
              className={cn(
                'text-xs mt-1',
                isActive ? 'text-[hsl(var(--tab-bar-active))]' : 'text-[hsl(var(--tab-bar-inactive))]'
              )}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}