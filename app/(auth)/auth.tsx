import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { useStore } from '@/lib/store';
import { Icon } from '@/components/ui/icon';
import { TwitterIcon } from 'lucide-react-native';
import { CardInput } from '@/components/ui/card-input';
import { useLoginWithEmail } from '@privy-io/expo';

export default function Auth() {
  const { loginWithTwitter } = useStore();

  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [codeSent, setCodeSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const { sendCode, loginWithCode } = useLoginWithEmail({
    onError: (err: any) => setError(err?.message || 'Login failed'),
  }) as any;

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

  return (
    <>
      <Stack.Screen options={{ title: 'Sign In' }} />
      <View className="flex-1 bg-background px-6 justify-center gap-6">
        <Text variant="h2" className="text-center">Sign in with Twitter to start predicting.</Text>
        <Button className="h-12 rounded-xl" onPress={loginWithTwitter}>
          <Icon as={TwitterIcon} size={18} />
          <Text className="text-lg">Connect with Twitter</Text>
        </Button>

        <View className="mt-6 gap-3">
          <Text className="text-center text-muted-foreground">Or, test login with email</Text>
          <CardInput
            placeholder="Email"
            inputMode="email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {codeSent && (
            <CardInput
              placeholder="Verification Code"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />
          )}
          {!codeSent ? (
            <Button variant="outline" onPress={onSendCode} disabled={loading || !email}>
              <Text>Send Code</Text>
            </Button>
          ) : (
            <Button onPress={onLogin} disabled={loading || !code}>
              <Text>Login</Text>
            </Button>
          )}
          {error && <Text className="text-destructive text-center">{error}</Text>}
        </View>
      </View>
    </>
  );
}
