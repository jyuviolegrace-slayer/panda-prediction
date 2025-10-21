import React from 'react';
import { View, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate,
  Easing
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

export function AuthIllustration() {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    // Gentle floating animation
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 20000,
        easing: Easing.linear,
      }),
      -1
    );
    
    scale.value = withRepeat(
      withTiming(1.05, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  const floatingDots = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${-rotation.value * 0.5}deg` },
      ],
    };
  });

  return (
    <View className="relative h-80 w-full items-center justify-center">
      {/* Background gradient dome */}
      <View className="absolute h-64 w-64 rounded-full bg-gradient-to-b from-auth-primary/20 to-auth-secondary/10" />
      
      {/* Floating decorative dots */}
      <Animated.View style={floatingDots} className="absolute">
        <View className="absolute -top-20 -left-16 h-3 w-3 rounded-full bg-auth-accent/60" />
        <View className="absolute -top-12 right-20 h-2 w-2 rounded-full bg-auth-primary/80" />
        <View className="absolute top-16 -right-20 h-4 w-4 rounded-full bg-auth-secondary/50" />
        <View className="absolute bottom-8 -left-24 h-2.5 w-2.5 rounded-full bg-auth-accent/70" />
      </Animated.View>

      {/* Main illustration container */}
      <Animated.View style={animatedStyle} className="relative">
        {/* Glass dome effect */}
        <View className="h-48 w-48 rounded-full bg-gradient-to-b from-auth-primary/30 to-transparent border border-auth-border/30 backdrop-blur-sm">
          {/* Inner content */}
          <View className="absolute inset-4 flex items-center justify-center">
            {/* Bitcoin/Crypto symbol placeholder */}
            {/* TODO: Replace with actual crypto/auth icon */}
            <Image
              source={{ uri: 'https://via.placeholder.com/80x80/FFD700/000000?text=₿' }}
              className="h-20 w-20 rounded-full"
              style={{ tintColor: '#FFD700' }}
            />
            
            {/* Stacked elements representing data/security */}
            <View className="absolute bottom-4 flex-row gap-1">
              <View className="h-6 w-4 rounded bg-auth-primary/60" />
              <View className="h-8 w-4 rounded bg-auth-secondary/60" />
              <View className="h-5 w-4 rounded bg-auth-accent/60" />
              <View className="h-7 w-4 rounded bg-green-500/60" />
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Bottom glow effect */}
      <View className="absolute bottom-0 h-32 w-64 rounded-full bg-auth-primary/10 blur-xl" />
    </View>
  );
}