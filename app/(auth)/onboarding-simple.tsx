import { OnboardingCard } from '@/components/ui/onboarding-card';
import { OnboardingNavigation } from '@/components/ui/onboarding-navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { router, Stack } from 'expo-router';
import * as React from 'react';
import { Dimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreen {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const onboardingData: OnboardingScreen[] = [
  {
    id: 1,
    title: 'Node',
    subtitle: 'The new NFT marketplace',
    description: 'Node is a platform that aims to build a new creative economy.',
    image: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=NFT+Marketplace',
  },
  {
    id: 2,
    title: 'Secure',
    subtitle: 'Get success in the crypto art',
    description: 'Node is a platform that aims to build a new creative economy.',
    image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Crypto+Art',
  },
  {
    id: 3,
    title: 'NFT',
    subtitle: 'A new NFT experience',
    description: 'Node is a platform that aims to build a new creative economy.',
    image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=NFT+Experience',
  },
];

export default function OnboardingSimple() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const translateX = useSharedValue(0);

  const nextScreen = () => {
    if (currentIndex < onboardingData.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      translateX.value = withSpring(-newIndex * SCREEN_WIDTH);
    }
  };

  const prevScreen = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      translateX.value = withSpring(-newIndex * SCREEN_WIDTH);
    }
  };

  const skipToEnd = () => {
    const lastIndex = onboardingData.length - 1;
    setCurrentIndex(lastIndex);
    translateX.value = withSpring(-lastIndex * SCREEN_WIDTH);
  };

  const handleGetStarted = () => {
    // Navigate to auth screen or main app
    router.push('/(auth)/auth');
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-[hsl(var(--onboarding-background))]">
        {/* Decorative background elements */}
        <View className="absolute top-20 left-8 w-4 h-4 rounded-full bg-[hsl(var(--onboarding-secondary))] opacity-60" />
        <View className="absolute top-32 right-12 w-6 h-6 rounded-full bg-[hsl(var(--onboarding-accent))] opacity-40" />
        <View className="absolute bottom-40 left-12 w-3 h-3 rounded-full bg-[hsl(var(--onboarding-primary))] opacity-50" />
        <View className="absolute bottom-60 right-8 w-5 h-5 rounded-full bg-[hsl(var(--onboarding-secondary))] opacity-30" />

        {/* Screens container */}
        <Animated.View
          style={[
            animatedStyle,
            {
              flexDirection: 'row',
              width: SCREEN_WIDTH * onboardingData.length,
            },
          ]}
          className="flex-1"
        >
          {onboardingData.map((screen, index) => (
            <View key={screen.id} style={{ width: SCREEN_WIDTH }} className="flex-1">
              <OnboardingCard
                title={screen.title}
                subtitle={screen.subtitle}
                description={screen.description}
                imageUrl={screen.image}
                isActive={index === currentIndex}
                className="flex-1 justify-center"
              />
            </View>
          ))}
        </Animated.View>

        {/* Bottom section */}
        <View className="px-6 pb-12">
          <ProgressIndicator
            currentIndex={currentIndex}
            total={onboardingData.length}
            className="mb-8"
          />

          <OnboardingNavigation
            currentIndex={currentIndex}
            total={onboardingData.length}
            onNext={nextScreen}
            onPrevious={prevScreen}
            onSkip={skipToEnd}
            onGetStarted={handleGetStarted}
          />
        </View>
      </View>
    </>
  );
}