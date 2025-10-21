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

const onboardingData: OnboardingScreen[] = [
  {
    id: 1,
    title: 'Node',
    subtitle: 'The new NFT marketplace',
    description: 'Node is a platform that aims to build a new creative economy.',
    image: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=NFT+Marketplace',
    backgroundColor: 'bg-[hsl(var(--onboarding-background))]',
  },
  {
    id: 2,
    title: 'Secure',
    subtitle: 'Get success in the crypto art',
    description: 'Node is a platform that aims to build a new creative economy.',
    image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Crypto+Art',
    backgroundColor: 'bg-[hsl(var(--onboarding-background))]',
  },
  {
    id: 3,
    title: 'NFT',
    subtitle: 'A new NFT experience',
    description: 'Node is a platform that aims to build a new creative economy.',
    image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=NFT+Experience',
    backgroundColor: 'bg-[hsl(var(--onboarding-background))]',
  },
];

const ProgressDots = ({ currentIndex, total }: { currentIndex: number; total: number }) => {
  return (
    <View className="flex-row justify-center gap-2 mb-8">
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
    <Animated.View
      style={[animatedStyle]}
      className="flex-1 items-center justify-center px-6"
    >
      {/* Decorative elements */}
      <View className="absolute top-20 left-8 w-4 h-4 rounded-full bg-[hsl(var(--onboarding-secondary))] opacity-60" />
      <View className="absolute top-32 right-12 w-6 h-6 rounded-full bg-[hsl(var(--onboarding-accent))] opacity-40" />
      <View className="absolute bottom-40 left-12 w-3 h-3 rounded-full bg-[hsl(var(--onboarding-primary))] opacity-50" />
      <View className="absolute bottom-60 right-8 w-5 h-5 rounded-full bg-[hsl(var(--onboarding-secondary))] opacity-30" />

      {/* Main content */}
      <View className="items-center mb-12">
        <Animated.View
          entering={FadeInRight.delay(200)}
          className="mb-8 p-4 rounded-3xl bg-[hsl(var(--onboarding-card))] shadow-lg"
        >
          <Image
            source={{ uri: screen.image }}
            className="w-64 h-48 rounded-2xl"
            resizeMode="cover"
          />
          {/* TODO: Replace with actual image asset */}
        </Animated.View>

        <Animated.View entering={FadeInRight.delay(400)} className="items-center">
          <Text
            variant="h1"
            className="text-[hsl(var(--onboarding-text))] mb-2 text-5xl font-bold"
          >
            {screen.title}
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInRight.delay(600)} className="items-center px-4">
        <Text
          variant="h3"
          className="text-[hsl(var(--onboarding-text))] text-center mb-4 text-2xl font-semibold"
        >
          {screen.subtitle}
        </Text>
        <Text
          variant="lead"
          className="text-[hsl(var(--onboarding-muted))] text-center leading-6 max-w-sm"
        >
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
        <View className="absolute top-12 right-6 z-10">
          <Pressable
            onPress={skipToEnd}
            className="px-4 py-2 rounded-full bg-[hsl(var(--onboarding-card))] opacity-80"
          >
            <Text className="text-[hsl(var(--onboarding-muted))] font-medium">Skip</Text>
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
          className="flex-1"
        >
          {onboardingData.map((screen, index) => (
            <View key={screen.id} style={{ width: SCREEN_WIDTH }} className="flex-1">
              <OnboardingScreenComponent
                screen={screen}
                isActive={index === currentIndex}
              />
            </View>
          ))}
        </Animated.View>

        {/* Bottom navigation */}
        <View className="px-6 pb-12">
          <ProgressDots currentIndex={currentIndex} total={onboardingData.length} />

          <View className="flex-row justify-between items-center">
            {/* Back button */}
            <Pressable
              onPress={prevScreen}
              disabled={currentIndex === 0}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                currentIndex === 0
                  ? 'bg-transparent'
                  : 'bg-[hsl(var(--onboarding-card))] active:bg-[hsl(var(--onboarding-card))]/80'
              }`}
            >
              {currentIndex > 0 && (
                <Text className="text-[hsl(var(--onboarding-text))] text-lg">←</Text>
              )}
            </Pressable>

            {/* Next/Get Started button */}
            {isLastScreen ? (
              <Link href="/(auth)/auth" asChild>
                <Button className="flex-1 mx-4 h-14 rounded-2xl bg-[hsl(var(--onboarding-primary))] active:bg-[hsl(var(--onboarding-primary))]/90">
                  <Text className="text-white text-lg font-semibold">Get Started</Text>
                </Button>
              </Link>
            ) : (
              <Button
                onPress={nextScreen}
                className="flex-1 mx-4 h-14 rounded-2xl bg-[hsl(var(--onboarding-primary))] active:bg-[hsl(var(--onboarding-primary))]/90"
              >
                <Text className="text-white text-lg font-semibold">Next</Text>
              </Button>
            )}

            {/* Forward button */}
            <Pressable
              onPress={nextScreen}
              disabled={isLastScreen}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                isLastScreen
                  ? 'bg-transparent'
                  : 'bg-[hsl(var(--onboarding-card))] active:bg-[hsl(var(--onboarding-card))]/80'
              }`}
            >
              {!isLastScreen && (
                <Text className="text-[hsl(var(--onboarding-text))] text-lg">→</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}