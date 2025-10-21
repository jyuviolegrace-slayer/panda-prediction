import { cn } from '@/lib/utils';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Button } from './button';
import { Text } from './text';

interface OnboardingNavigationProps {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onGetStarted: () => void;
  className?: string;
}

export function OnboardingNavigation({
  currentIndex,
  total,
  onNext,
  onPrevious,
  onSkip,
  onGetStarted,
  className,
}: OnboardingNavigationProps) {
  const isFirstScreen = currentIndex === 0;
  const isLastScreen = currentIndex === total - 1;

  const backButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isFirstScreen ? 0 : 1, {
        damping: 15,
        stiffness: 150,
      }),
      transform: [
        {
          scale: withSpring(isFirstScreen ? 0.8 : 1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  const forwardButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isLastScreen ? 0 : 1, {
        damping: 15,
        stiffness: 150,
      }),
      transform: [
        {
          scale: withSpring(isLastScreen ? 0.8 : 1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  return (
    <View className={cn('px-6 pb-12', className)}>
      {/* Skip button */}
      {!isLastScreen && (
        <View className="absolute top-0 right-6 z-10">
          <Pressable
            onPress={onSkip}
            className="px-4 py-2 rounded-full bg-[hsl(var(--onboarding-card))] opacity-80 active:opacity-100"
          >
            <Text className="text-[hsl(var(--onboarding-muted))] font-medium">Skip</Text>
          </Pressable>
        </View>
      )}

      {/* Navigation controls */}
      <View className="flex-row justify-between items-center">
        {/* Back button */}
        <Animated.View style={[backButtonStyle]}>
          <Pressable
            onPress={onPrevious}
            disabled={isFirstScreen}
            className="w-12 h-12 rounded-full items-center justify-center bg-[hsl(var(--onboarding-card))] active:bg-[hsl(var(--onboarding-card))]/80"
          >
            <Text className="text-[hsl(var(--onboarding-text))] text-lg">←</Text>
          </Pressable>
        </Animated.View>

        {/* Main action button */}
        {isLastScreen ? (
          <Button
            onPress={onGetStarted}
            className="flex-1 mx-4 h-14 rounded-2xl bg-[hsl(var(--onboarding-primary))] active:bg-[hsl(var(--onboarding-primary))]/90"
          >
            <Text className="text-white text-lg font-semibold">Get Started</Text>
          </Button>
        ) : (
          <Button
            onPress={onNext}
            className="flex-1 mx-4 h-14 rounded-2xl bg-[hsl(var(--onboarding-primary))] active:bg-[hsl(var(--onboarding-primary))]/90"
          >
            <Text className="text-white text-lg font-semibold">Next</Text>
          </Button>
        )}

        {/* Forward button */}
        <Animated.View style={[forwardButtonStyle]}>
          <Pressable
            onPress={onNext}
            disabled={isLastScreen}
            className="w-12 h-12 rounded-full items-center justify-center bg-[hsl(var(--onboarding-card))] active:bg-[hsl(var(--onboarding-card))]/80"
          >
            <Text className="text-[hsl(var(--onboarding-text))] text-lg">→</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}