import React from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Image, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

interface TwitterLoginButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export function TwitterLoginButton({ onPress, loading = false }: TwitterLoginButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withTiming(0.8);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1);
    runOnJS(onPress)();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Button
        className={cn(
          'border-auth-border/50 h-14 rounded-2xl border bg-primary',
          'active:bg-auth-card-hover shadow-lg shadow-black/20',
          loading && 'opacity-50'
        )}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading}>
        <View className="flex-row items-center gap-3">
          {/* TODO: Replace with actual Twitter logo */}
          <Image
            source={{
              uri: 'https://rhiveaobslchlliqharj.supabase.co/storage/v1/object/public/thumbnails/x-logo.jpg',
            }}
            className="h-6 w-6 rounded"
          />
          <Text className="text-auth-text text-lg font-medium">
            {loading ? 'Connecting...' : 'Login with Twitter'}
          </Text>
        </View>
      </Button>
    </Animated.View>
  );
}
