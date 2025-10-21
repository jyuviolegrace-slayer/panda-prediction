import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import * as React from 'react';
import { Dimensions, Image, Pressable, View } from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreen {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  backgroundColor: string;
}

// const onboardingData: OnboardingScreen[] = [
//   {
//     id: 1,
//     title: 'Node',
//     subtitle: 'The new NFT marketplace',
//     description: 'Node is a platform that aims to build a new creative economy.',
//     image: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=NFT+Marketplace',
//     backgroundColor: 'bg-[hsl(var(--onboarding-background))]',
//   },
//   {
//     id: 2,
//     title: 'Secure',
//     subtitle: 'Get success in the crypto art',
//     description: 'Node is a platform that aims to build a new creative economy.',
//     image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Crypto+Art',
//     backgroundColor: 'bg-[hsl(var(--onboarding-background))]',
//   },
//   {
//     id: 3,
//     title: 'NFT',
//     subtitle: 'A new NFT experience',
//     description: 'Node is a platform that aims to build a new creative economy.',
//     image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=NFT+Experience',
//     backgroundColor: 'bg-[hsl(var(--onboarding-background))]',
//   },
// ];

const onboardingData: OnboardingScreen[] = [
  {
    id: 1,
    title: 'Bet Bold',
    subtitle: 'Unleash Your Predictions',
    description:
      'Dive into a vibrant Solana market where you shape bets on anything, openly and freely.',
    image: 'https://via.placeholder.com/300x200/4f46e5/ffffff?text=Bold+Bets',
    backgroundColor: 'bg-[hsl(var(--onboarding-background))]',
  },
  {
    id: 2,
    title: 'Lightning Fast',
    subtitle: 'Solana’s Edge',
    description: 'Zip through trades with Solana’s speed—secure, cheap, and unstoppable.',
    image: 'https://via.placeholder.com/300x200/059669/ffffff?text=Fast+Trades',
    backgroundColor: 'bg-[hsl(var(--onboarding-background))]',
  },
  {
    id: 3,
    title: 'No Limits',
    subtitle: 'Own the Future',
    description: 'Create or join markets on any topic - no gatekeepers, just pure potential.',
    image: 'https://via.placeholder.com/300x200/d97706/ffffff?text=Limitless',
    backgroundColor: 'bg-[hsl(var(--onboarding-background))]',
  },
];

const ProgressDots = ({ currentIndex, total }: { currentIndex: number; total: number }) => {
  return (
    <View className="mb-8 flex-row justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <Animated.View
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === currentIndex
              ? 'w-8 bg-[hsl(var(--onboarding-primary))]'
              : 'w-2 bg-[hsl(var(--onboarding-muted))]'
          }`}
        />
      ))}
    </View>
  );
};

const OnboardingScreenComponent = ({
  screen,
  isActive,
}: {
  screen: OnboardingScreen;
  isActive: boolean;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActive ? 1 : 0.7, { duration: 300 }),
      transform: [
        {
          scale: withSpring(isActive ? 1 : 0.95, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  return (
    <Animated.View style={[animatedStyle]} className="flex-1 items-center justify-center px-6">
      {/* Decorative elements */}
      <View className="absolute left-8 top-20 h-4 w-4 rounded-full bg-[hsl(var(--onboarding-secondary))] opacity-60" />
      <View className="absolute right-12 top-32 h-6 w-6 rounded-full bg-[hsl(var(--onboarding-accent))] opacity-40" />
      <View className="absolute bottom-40 left-12 h-3 w-3 rounded-full bg-[hsl(var(--onboarding-primary))] opacity-50" />
      <View className="absolute bottom-60 right-8 h-5 w-5 rounded-full bg-[hsl(var(--onboarding-secondary))] opacity-30" />

      {/* Main content */}
      <View className="mb-12 items-center">
        <Animated.View
          entering={FadeInRight.delay(200)}
          className="mb-8 rounded-3xl bg-[hsl(var(--onboarding-card))] p-4 shadow-lg">
          <Image
            source={{ uri: screen.image }}
            className="h-48 w-64 rounded-2xl"
            resizeMode="cover"
          />
          {/* TODO: Replace with actual image asset */}
        </Animated.View>

        <Animated.View entering={FadeInRight.delay(400)} className="items-center">
          <Text variant="h1" className="mb-2 text-5xl font-bold text-[hsl(var(--onboarding-text))]">
            {screen.title}
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInRight.delay(600)} className="items-center px-4">
        <Text
          variant="h3"
          className="mb-4 text-center text-2xl font-semibold text-[hsl(var(--onboarding-text))]">
          {screen.subtitle}
        </Text>
        <Text
          variant="lead"
          className="max-w-sm text-center leading-6 text-[hsl(var(--onboarding-muted))]">
          {screen.description}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const translateX = useSharedValue(0);

  const nextScreen = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      translateX.value = withSpring(-(currentIndex + 1) * SCREEN_WIDTH);
    }
  };

  const prevScreen = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      translateX.value = withSpring(-(currentIndex - 1) * SCREEN_WIDTH);
    }
  };

  const skipToEnd = () => {
    setCurrentIndex(onboardingData.length - 1);
    translateX.value = withSpring(-(onboardingData.length - 1) * SCREEN_WIDTH);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const isLastScreen = currentIndex === onboardingData.length - 1;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-[hsl(var(--onboarding-background))]">
        {/* Skip button */}
        <View className="absolute right-6 top-12 z-10">
          <Pressable
            onPress={skipToEnd}
            className="rounded-full bg-[hsl(var(--onboarding-card))] px-4 py-2 opacity-80">
            <Text className="font-medium text-[hsl(var(--onboarding-muted))]">Skip</Text>
          </Pressable>
        </View>

        {/* Screens container */}
        <Animated.View
          style={[
            animatedStyle,
            {
              flexDirection: 'row',
              width: SCREEN_WIDTH * onboardingData.length,
            },
          ]}
          className="flex-1">
          {onboardingData.map((screen, index) => (
            <View key={screen.id} style={{ width: SCREEN_WIDTH }} className="flex-1">
              <OnboardingScreenComponent screen={screen} isActive={index === currentIndex} />
            </View>
          ))}
        </Animated.View>

        {/* Bottom navigation */}
        <View className="px-6 pb-12">
          <ProgressDots currentIndex={currentIndex} total={onboardingData.length} />

          <View className="flex-row items-center justify-between">
            {/* Back button */}
            <Pressable
              onPress={prevScreen}
              disabled={currentIndex === 0}
              className={`h-12 w-12 items-center justify-center rounded-full ${
                currentIndex === 0
                  ? 'bg-transparent'
                  : 'bg-[hsl(var(--onboarding-card))] active:bg-[hsl(var(--onboarding-card))]/80'
              }`}>
              {currentIndex > 0 && (
                <Text className="text-lg text-[hsl(var(--onboarding-text))]">←</Text>
              )}
            </Pressable>

            {/* Next/Get Started button */}
            {isLastScreen ? (
              <Link href="/(auth)/auth" asChild>
                <Button className="mx-4 h-14 flex-1 rounded-2xl bg-[hsl(var(--onboarding-primary))] active:bg-[hsl(var(--onboarding-primary))]/90">
                  <Text className="text-lg font-semibold text-white">Get Started</Text>
                </Button>
              </Link>
            ) : (
              <Button
                onPress={nextScreen}
                className="mx-4 h-14 flex-1 rounded-2xl bg-[hsl(var(--onboarding-primary))] active:bg-[hsl(var(--onboarding-primary))]/90">
                <Text className="text-lg font-semibold text-white">Next</Text>
              </Button>
            )}

            {/* Forward button */}
            <Pressable
              onPress={nextScreen}
              disabled={isLastScreen}
              className={`h-12 w-12 items-center justify-center rounded-full ${
                isLastScreen
                  ? 'bg-transparent'
                  : 'bg-[hsl(var(--onboarding-card))] active:bg-[hsl(var(--onboarding-card))]/80'
              }`}>
              {!isLastScreen && (
                <Text className="text-lg text-[hsl(var(--onboarding-text))]">→</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}
