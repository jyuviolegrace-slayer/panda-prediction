import * as React from 'react';
import { Image, View } from 'react-native';
import { Stack } from 'expo-router';
import { useStore } from '@/lib/store';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProfileScreen() {
  const { user, logout } = useStore();

  if (!user) return null;

  return (
    <>
      <Stack.Screen options={{ title: 'Profile' }} />
      <View className="flex-1 bg-background">
        <View className="relative">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop',
            }}
            className="h-40 w-full"
          />
          <Image source={{ uri: user.avatar }} className="absolute -bottom-8 left-6 h-20 w-20 rounded-full border-2 border-background" />
        </View>
        <View className="mt-12 px-6 gap-2">
          <Text variant="h3">{user.username}</Text>
          <Text className="text-primary">{user.twitter}</Text>
        </View>
        <View className="mt-6 px-6 flex-row gap-3">
          <Card className="flex-1 items-center py-4">
            <Text className="text-muted-foreground">Votes</Text>
            <Text variant="large" className="font-semibold">{user.stats.votes}</Text>
          </Card>
          <Card className="flex-1 items-center py-4">
            <Text className="text-muted-foreground">Accuracy</Text>
            <Text variant="large" className="font-semibold">{user.stats.accuracy}%</Text>
          </Card>
          <Card className="flex-1 items-center py-4">
            <Text className="text-muted-foreground">Winnings</Text>
            <Text variant="large" className="font-semibold">{user.stats.winnings} USDC</Text>
          </Card>
        </View>
        <View className="mt-8 px-6">
          <Button variant="outline" className="rounded-xl" onPress={logout}>
            <Text>Log out</Text>
          </Button>
        </View>
      </View>
    </>
  );
}
