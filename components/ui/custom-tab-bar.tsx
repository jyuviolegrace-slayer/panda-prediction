import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CustomTabBarProps = BottomTabBarProps;

function TabItem({
  route,
  isFocused,
  onPress,
  IconComponent,
}: {
  route: any;
  isFocused: boolean;
  onPress: () => void;
  IconComponent: any;
}) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.15 : 1, {
      damping: 12,
      stiffness: 150,
    });
    translateY.value = withSpring(isFocused ? -2 : 0, {
      damping: 12,
      stiffness: 150,
    });
  }, [isFocused, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <TouchableOpacity
      key={route.key}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      style={styles.tabItem}>
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        {IconComponent && <IconComponent color={isFocused ? '#5B8EF5' : '#6B7280'} />}
        {isFocused && <View style={styles.activeDot} />}
      </Animated.View>
    </TouchableOpacity>
  );
}

function CreateButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, {
      damping: 10,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 200,
    });
    rotation.value = withTiming(rotation.value + 180, { duration: 400 });
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={styles.tabItem}
      activeOpacity={0.8}>
      <Animated.View style={[styles.centerButton, animatedStyle]}>
        <Plus color="#FFFFFF" size={28} strokeWidth={2.5} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleCreatePress = () => {
    router.push('/create-vote');
    // alert('Create pressed');
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
        },
      ]}>
      {state.routes.slice(0, 2).map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const IconComponent = options.tabBarIcon as any;

        return (
          <TabItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            onPress={onPress}
            IconComponent={IconComponent}
          />
        );
      })}

      <CreateButton onPress={handleCreatePress} />

      {state.routes.slice(2).map((route, index) => {
        const { options } = descriptors[route.key];
        const actualIndex = index + 2;
        const isFocused = state.index === actualIndex;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const IconComponent = options.tabBarIcon as any;

        return (
          <TabItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            onPress={onPress}
            IconComponent={IconComponent}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B8EF5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B8EF5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  activeDot: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5B8EF5',
  },
});

// import React from 'react';
// import {
//   View,
//   Pressable,
//   Platform,
//   StyleSheet,
//   Animated as RNAnimated,
//   TouchableOpacity,
// } from 'react-native';
// import { router, usePathname } from 'expo-router';
// import { Icon } from '@/components/ui/icon';
// import { Text } from '@/components/ui/text';
// import { HomeIcon, SearchIcon, TrendingUpIcon, UserIcon, PlusIcon } from 'lucide-react-native';
// import { cn } from '@/lib/utils';
// import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
// import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// // interface TabBarProps {
// //   className?: string;
// // }

// // const tabs = [
// //   { name: 'home', icon: HomeIcon, label: 'Home', route: '/(tabs)/home' },
// //   { name: 'search', icon: SearchIcon, label: 'Search', route: '/(tabs)/search' },
// //   { name: 'plus', icon: PlusIcon, label: 'Create', route: '/create-vote' },
// //   { name: 'leaderboard', icon: TrendingUpIcon, label: 'Leaderboard', route: '/(tabs)/leaderboard' },
// //   { name: 'profile', icon: UserIcon, label: 'Profile', route: '/(tabs)/profile' },
// // ];

// // export function CustomTabBarV2({ className }: TabBarProps) {
// //   const pathname = usePathname();
// //   const plusScale = useSharedValue(1);

// //   const getCurrentTab = () => {
// //     if (pathname.includes('/home')) return 'home';
// //     if (pathname.includes('/search')) return 'search';
// //     if (pathname.includes('/leaderboard')) return 'leaderboard';
// //     if (pathname.includes('/profile')) return 'profile';
// //     return 'home';
// //   };

// //   const currentTab = getCurrentTab();

// //   const handleTabPress = (tab: (typeof tabs)[0]) => {
// //     if (tab.name === 'plus') {
// //       // Animate plus button
// //       plusScale.value = withSpring(0.9, { duration: 100 }, () => {
// //         plusScale.value = withSpring(1, { duration: 100 });
// //       });
// //       console.log('Create new prediction');
// //       router.push('/create-vote');
// //     } else {
// //       router.push(tab.route as any);
// //     }
// //   };

// //   const plusAnimatedStyle = useAnimatedStyle(() => ({
// //     transform: [{ scale: plusScale.value }],
// //   }));

// //   return (
// //     <View
// //       className={cn(
// //         'flex-row items-center justify-around border-t border-[hsl(var(--border))] bg-[hsl(var(--tab-bar-background))]',
// //         className
// //       )}
// //       style={{
// //         height: Platform.OS === 'ios' ? 88 : 72,
// //         paddingBottom: Platform.OS === 'ios' ? 34 : 16,
// //       }}>
// //       {tabs.map((tab, index) => {
// //         const isActive = currentTab === tab.name;
// //         const isPlusButton = tab.name === 'plus';

// //         if (isPlusButton) {
// //           return (
// //             <Animated.View key={tab.name} style={plusAnimatedStyle}>
// //               <Pressable
// //                 onPress={() => handleTabPress(tab)}
// //                 className="h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--tab-bar-plus-bg))]"
// //                 accessibilityLabel={tab.label}
// //                 accessibilityRole="button">
// //                 <Icon as={tab.icon} size={24} color="hsl(var(--tab-bar-plus-fg))" />
// //               </Pressable>
// //             </Animated.View>
// //           );
// //         }

// //         return (
// //           <Pressable
// //             key={tab.name}
// //             onPress={() => handleTabPress(tab)}
// //             className="flex-1 items-center justify-center py-2"
// //             accessibilityLabel={tab.label}
// //             accessibilityRole="button">
// //             <Icon
// //               as={tab.icon}
// //               size={20}
// //               color={isActive ? 'hsl(var(--tab-bar-active))' : 'hsl(var(--tab-bar-inactive))'}
// //             />
// //             <Text
// //               className={cn(
// //                 'mt-1 text-xs',
// //                 isActive
// //                   ? 'text-[hsl(var(--tab-bar-active))]'
// //                   : 'text-[hsl(var(--tab-bar-inactive))]'
// //               )}>
// //               {tab.label}
// //             </Text>
// //           </Pressable>
// //         );
// //       })}
// //     </View>
// //   );
// // }

// type CustomTabBarProps = BottomTabBarProps;

// export function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
//   const insets = useSafeAreaInsets();
//   const animations = React.useRef(state.routes.map(() => new RNAnimated.Value(1))).current;

//   React.useEffect(() => {
//     state.routes.forEach((_, index) => {
//       RNAnimated.spring(animations[index], {
//         toValue: state.index === index ? 1.15 : 1,
//         friction: 7,
//         tension: 100,
//         useNativeDriver: true,
//       }).start();
//     });
//   }, [state.index, animations, state.routes]);

//   return (
//     <View
//       style={[
//         styles.tabBarContainer,
//         {
//           paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
//         },
//       ]}>
//       {state.routes.map((route, index) => {
//         const { options } = descriptors[route.key];
//         const isFocused = state.index === index;
//         const isCenter = index === 2;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name);
//           }
//         };

//         const IconComponent = options.tabBarIcon as any;

//         return (
//           <TouchableOpacity
//             key={route.key}
//             accessibilityRole="button"
//             accessibilityState={isFocused ? { selected: true } : {}}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             onPress={onPress}
//             style={styles.tabItem}>
//             <RNAnimated.View
//               style={[
//                 isCenter ? styles.centerButton : styles.iconContainer,
//                 {
//                   transform: [{ scale: animations[index] }],
//                 },
//               ]}>
//               {IconComponent && (
//                 <IconComponent color={isCenter ? '#FFFFFF' : isFocused ? '#5B8EF5' : '#6B7280'} />
//               )}
//               {isFocused && !isCenter && <View style={styles.activeDot} />}
//             </RNAnimated.View>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   tabBarContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#1A1A1A',
//     borderTopWidth: 1,
//     borderTopColor: '#2A2A2A',
//     paddingTop: 12,
//     paddingHorizontal: 20,
//   },
//   tabItem: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   iconContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//   },
//   centerButton: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#5B8EF5',
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#5B8EF5',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   activeDot: {
//     position: 'absolute',
//     bottom: -8,
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#5B8EF5',
//   },
// });
