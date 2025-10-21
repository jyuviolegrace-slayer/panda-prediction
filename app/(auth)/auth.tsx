import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import * as React from 'react';
import { View, StatusBar } from 'react-native';
import { useStore } from '@/lib/store';
import { AuthIllustration } from '@/components/auth/auth-illustration';
import { TwitterLoginButton } from '@/components/auth/twitter-login-button';
import { EmailAuthSection } from '@/components/auth/email-auth-section';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function Auth() {
  const { loginWithTwitter, sendCode, loginWithCode } = useStore();

  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [codeSent, setCodeSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [twitterLoading, setTwitterLoading] = React.useState(false);

  async function onSendCode() {
    setError(null);
    setLoading(true);
    try {
      await sendCode?.({ email });
      setCodeSent(true);
    } catch (e: any) {
      setError(e?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  }

  async function onLogin() {
    setError(null);
    setLoading(true);
    try {
      await loginWithCode?.({ email, code });
    } catch (e: any) {
      setError(e?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  }

  async function onTwitterLogin() {
    setTwitterLoading(true);
    try {
      await loginWithTwitter();
    } catch (e: any) {
      setError(e?.message || 'Failed to login with Twitter');
    } finally {
      setTwitterLoading(false);
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="hsl(230, 35%, 7%)" />
      <Stack.Screen
        options={{
          title: 'Auth',
          headerShown: false,
        }}
      />
      <View className="bg-auth-background flex-1">
        {/* Main content container */}
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <Animated.View entering={FadeInUp.delay(200).duration(600)} className="mb-8 items-center">
            <Text variant="h1" className="text-auth-text mb-2 text-center text-3xl font-bold">
              Auth
            </Text>
            <Text className="text-auth-muted text-center text-base">
              Choose your authentication method
            </Text>
          </Animated.View>

          {/* 3D Illustration */}
          <Animated.View entering={FadeInUp.delay(400).duration(800)} className="mb-8">
            <AuthIllustration />
          </Animated.View>

          {/* Authentication Options */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)} className="gap-6">
            {/* Twitter Login */}
            <TwitterLoginButton onPress={onTwitterLogin} loading={twitterLoading} />

            {/* Divider */}
            <View className="flex-row items-center gap-4">
              <View className="bg-auth-border/30 h-px flex-1" />
              <Text className="text-auth-muted text-sm">or</Text>
              <View className="bg-auth-border/30 h-px flex-1" />
            </View>

            {/* Email Authentication */}
            <EmailAuthSection
              email={email}
              code={code}
              codeSent={codeSent}
              loading={loading}
              error={error}
              onEmailChange={setEmail}
              onCodeChange={setCode}
              onSendCode={onSendCode}
              onLogin={onLogin}
            />
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View entering={FadeInUp.delay(800).duration(400)} className="px-6 pb-8">
          <Text className="text-auth-muted text-center text-xs">
            By connecting your account, you agree to our{' '}
            <Text className="text-auth-primary">Terms of Service</Text> and{' '}
            <Text className="text-auth-primary">Privacy Policy</Text>
          </Text>
        </Animated.View>
      </View>
    </>
  );
}
