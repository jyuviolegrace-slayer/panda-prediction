import { cn } from '@/lib/utils';
import * as React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface ProgressIndicatorProps {
  currentIndex: number;
  total: number;
  variant?: 'dots' | 'bar';
  className?: string;
}

export function ProgressIndicator({
  currentIndex,
  total,
  variant = 'dots',
  className,
}: ProgressIndicatorProps) {
  if (variant === 'bar') {
    const progressAnimatedStyle = useAnimatedStyle(() => {
      const progress = (currentIndex + 1) / total;
      return {
        width: withSpring(`${progress * 100}%`, {
          damping: 15,
          stiffness: 150,
        }),
      };
    });

    return (
      <View className={cn('h-2 bg-[hsl(var(--onboarding-muted))]/30 rounded-full', className)}>
        <Animated.View
          style={[progressAnimatedStyle]}
          className="h-full bg-[hsl(var(--onboarding-primary))] rounded-full"
        />
      </View>
    );
  }

  return (
    <View className={cn('flex-row justify-center gap-2', className)}>
      {Array.from({ length: total }).map((_, index) => {
        const dotAnimatedStyle = useAnimatedStyle(() => {
          const isActive = index === currentIndex;
          return {
            width: withTiming(isActive ? 32 : 8, { duration: 300 }),
            backgroundColor: withTiming(
              isActive
                ? 'hsl(var(--onboarding-primary))'
                : 'hsl(var(--onboarding-muted))',
              { duration: 300 }
            ),
          };
        });

        return (
          <Animated.View
            key={index}
            style={[dotAnimatedStyle]}
            className="h-2 rounded-full"
          />
        );
      })}
    </View>
  );
}