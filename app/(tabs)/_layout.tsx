import { Stack, Tabs } from 'expo-router';
import * as React from 'react';
import { View, Animated, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomTabBar } from '@/components/ui/custom-tab-bar';
import { NAV_THEME } from '@/lib/theme';
import { ActivityIcon, Home, PlusIcon, SearchIcon, UserIcon } from 'lucide-react-native';

export default function TabsLayout() {
  var x = (
    <View className="flex-1 bg-background">
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: NAV_THEME.dark.colors.card },
          headerTintColor: NAV_THEME.dark.colors.text,
          headerShadowVisible: false,
        }}>
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
      {/* <CustomTabBar /> */}
    </View>
  );

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={24} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <SearchIcon color={color} size={24} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <PlusIcon color={color} size={28} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <ActivityIcon color={color} size={24} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <UserIcon color={color} size={24} strokeWidth={2} />,
        }}
      />
      {/* <Tabs.Screen
        name="CustomTabBar"
        options={{
          href: null,
        }}
      /> */}
    </Tabs>
  );
}

// import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// type CustomTabBarProps = BottomTabBarProps;

// export function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
//   const insets = useSafeAreaInsets();
//   const animations = React.useRef(state.routes.map(() => new Animated.Value(1))).current;

//   React.useEffect(() => {
//     state.routes.forEach((_, index) => {
//       Animated.spring(animations[index], {
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
//             <Animated.View
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
//             </Animated.View>
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
