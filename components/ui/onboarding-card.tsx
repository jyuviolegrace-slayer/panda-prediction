import { cn } from '@/lib/utils';
import * as React from 'react';
import { Image, View } from 'react-native';
import Animated, { FadeInUp, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Text } from './text';

interface OnboardingCardProps {
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  isActive?: boolean;
  className?: string;
}

export function OnboardingCard({
  title,
  subtitle,
  description,
  imageUrl,
  isActive = true,
  className,
}: OnboardingCardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isActive ? 1 : 0.95, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
      opacity: withSpring(isActive ? 1 : 0.7, {
        damping: 15,
        stiffness: 150,
      }),
    };
  });

  return (
    <Animated.View
      style={[animatedStyle]}
      className={cn('items-center justify-center px-6', className)}
    >
      {/* Image container */}
      <Animated.View
        entering={FadeInUp.delay(200)}
        className="mb-8 p-4 rounded-3xl bg-[hsl(var(--onboarding-card))] shadow-lg"
      >
        <Image
          source={{ uri: imageUrl }}
          className="w-64 h-48 rounded-2xl"
          resizeMode="cover"
        />
        {/* TODO: Replace with actual image asset */}
      </Animated.View>

      {/* Title */}
      <Animated.View entering={FadeInUp.delay(400)} className="items-center mb-6">
        <Text
          variant="h1"
          className="text-[hsl(var(--onboarding-text))] mb-2 text-5xl font-bold text-center"
        >
          {title}
        </Text>
      </Animated.View>

      {/* Content */}
      <Animated.View entering={FadeInUp.delay(600)} className="items-center px-4">
        {subtitle && (
          <Text
            variant="h3"
            className="text-[hsl(var(--onboarding-text))] text-center mb-4 text-2xl font-semibold"
          >
            {subtitle}
          </Text>
        )}
        <Text
          variant="lead"
          className="text-[hsl(var(--onboarding-muted))] text-center leading-6 max-w-sm"
        >
          {description}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}