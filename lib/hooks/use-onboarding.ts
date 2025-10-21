import { useSharedValue } from 'react-native-reanimated';
import * as React from 'react';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface OnboardingScreen {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  backgroundColor?: string;
}

export function useOnboarding(screens: OnboardingScreen[]) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const translateX = useSharedValue(0);

  const nextScreen = React.useCallback(() => {
    if (currentIndex < screens.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      translateX.value = -newIndex * SCREEN_WIDTH;
    }
  }, [currentIndex, screens.length, translateX]);

  const prevScreen = React.useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      translateX.value = -newIndex * SCREEN_WIDTH;
    }
  }, [currentIndex, translateX]);

  const goToScreen = React.useCallback((index: number) => {
    if (index >= 0 && index < screens.length) {
      setCurrentIndex(index);
      translateX.value = -index * SCREEN_WIDTH;
    }
  }, [screens.length, translateX]);

  const skipToEnd = React.useCallback(() => {
    const lastIndex = screens.length - 1;
    setCurrentIndex(lastIndex);
    translateX.value = -lastIndex * SCREEN_WIDTH;
  }, [screens.length, translateX]);

  const isFirstScreen = currentIndex === 0;
  const isLastScreen = currentIndex === screens.length - 1;
  const currentScreen = screens[currentIndex];

  return {
    currentIndex,
    currentScreen,
    translateX,
    nextScreen,
    prevScreen,
    goToScreen,
    skipToEnd,
    isFirstScreen,
    isLastScreen,
    totalScreens: screens.length,
  };
}