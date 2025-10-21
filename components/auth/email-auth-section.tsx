import React, { useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { CardInput } from '@/components/ui/card-input';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

interface EmailAuthSectionProps {
  email: string;
  code: string;
  codeSent: boolean;
  loading: boolean;
  error: string | null;
  onEmailChange: (email: string) => void;
  onCodeChange: (code: string) => void;
  onSendCode: () => void;
  onLogin: () => void;
}

export function EmailAuthSection({
  email,
  code,
  codeSent,
  loading,
  error,
  onEmailChange,
  onCodeChange,
  onSendCode,
  onLogin,
}: EmailAuthSectionProps) {
  const [showTest, setShowTest] = useState(false);
  const errorOpacity = useSharedValue(0);

  React.useEffect(() => {
    errorOpacity.value = withTiming(error ? 1 : 0, { duration: 300 });
  }, [error]);

  const errorStyle = useAnimatedStyle(() => {
    return {
      opacity: errorOpacity.value,
      transform: [
        {
          translateY: withSpring(error ? 0 : -10),
        },
      ],
    };
  });

  if (!showTest) {
    return (
      <View>
        <Button onPress={() => setShowTest(true)}>
          <Text>Login With Test Account</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="gap-4">
      <Text className="text-auth-muted text-center text-base">Or, test login with email</Text>

      <View className="gap-3">
        <CardInput
          placeholder="Email"
          inputMode="email"
          autoCapitalize="none"
          value={email}
          onChangeText={onEmailChange}
          className={cn(
            'border-auth-border bg-auth-card/50 h-12 rounded-xl border',
            'text-auth-text placeholder:text-auth-muted/60',
            'focus:border-auth-primary focus:bg-auth-card'
          )}
        />

        {codeSent && (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
            <CardInput
              placeholder="Verification Code"
              keyboardType="number-pad"
              value={code}
              onChangeText={onCodeChange}
              className={cn(
                'border-auth-border bg-auth-card/50 h-12 rounded-xl border',
                'text-auth-text placeholder:text-auth-muted/60',
                'focus:border-auth-primary focus:bg-auth-card'
              )}
            />
          </Animated.View>
        )}

        {!codeSent ? (
          <Button
            variant="outline"
            onPress={onSendCode}
            disabled={loading || !email}
            className={cn(
              'border-auth-border bg-auth-card/30 h-12 rounded-xl border',
              'active:bg-auth-card/50 disabled:opacity-50'
            )}>
            <Text className="text-auth-text font-medium">
              {loading ? 'Sending...' : 'Send Code'}
            </Text>
          </Button>
        ) : (
          <Button
            onPress={onLogin}
            disabled={loading || !code}
            className={cn(
              'bg-auth-primary h-12 rounded-xl',
              'active:bg-auth-primary/90 disabled:opacity-50',
              'shadow-auth-primary/20 shadow-lg'
            )}>
            <Text className="font-medium text-white">{loading ? 'Logging in...' : 'Login'}</Text>
          </Button>
        )}

        {error && (
          <Animated.View style={errorStyle}>
            <Text className="text-center text-sm text-destructive">{error}</Text>
          </Animated.View>
        )}
      </View>

      <Button onPress={() => setShowTest(false)}>
        <Text>Cancel</Text>
      </Button>
    </View>
  );
}
