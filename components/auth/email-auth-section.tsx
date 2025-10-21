import React from 'react';
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
  FadeOut
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

  return (
    <View className="gap-4">
      <Text className="text-center text-auth-muted text-base">
        Or, test login with email
      </Text>
      
      <View className="gap-3">
        <CardInput
          placeholder="Email"
          inputMode="email"
          autoCapitalize="none"
          value={email}
          onChangeText={onEmailChange}
          className={cn(
            "h-12 rounded-xl border border-auth-border bg-auth-card/50",
            "text-auth-text placeholder:text-auth-muted/60",
            "focus:border-auth-primary focus:bg-auth-card"
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
                "h-12 rounded-xl border border-auth-border bg-auth-card/50",
                "text-auth-text placeholder:text-auth-muted/60",
                "focus:border-auth-primary focus:bg-auth-card"
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
              "h-12 rounded-xl border border-auth-border bg-auth-card/30",
              "active:bg-auth-card/50 disabled:opacity-50"
            )}
          >
            <Text className="text-auth-text font-medium">
              {loading ? 'Sending...' : 'Send Code'}
            </Text>
          </Button>
        ) : (
          <Button
            onPress={onLogin}
            disabled={loading || !code}
            className={cn(
              "h-12 rounded-xl bg-auth-primary",
              "active:bg-auth-primary/90 disabled:opacity-50",
              "shadow-lg shadow-auth-primary/20"
            )}
          >
            <Text className="text-white font-medium">
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </Button>
        )}
        
        {error && (
          <Animated.View style={errorStyle}>
            <Text className="text-center text-destructive text-sm">
              {error}
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}