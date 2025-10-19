import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { useStore } from '@/lib/store';
import { Icon } from '@/components/ui/icon';
import { TwitterIcon } from 'lucide-react-native';

export default function Auth() {
  const { loginWithTwitter } = useStore();

  return (
    <>
      <Stack.Screen options={{ title: 'Sign In' }} />
      <View className="flex-1 bg-background px-6 justify-center gap-6">
        <Text variant="h2" className="text-center">Sign in with Twitter to start predicting.</Text>
        <Button className="h-12 rounded-xl" onPress={loginWithTwitter}>
          <Icon as={TwitterIcon} size={18} />
          <Text className="text-lg">Connect with Twitter</Text>
        </Button>
      </View>
    </>
  );
}
