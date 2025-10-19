import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import * as React from 'react';
import { ImageBackground, View } from 'react-native';

export default function Landing() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={{
          uri:
            'https://images.unsplash.com/photo-1543165796-5426273eaab7?q=80&w=1600&auto=format&fit=crop',
        }}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="flex-1 bg-background/70 px-6 py-12 justify-end">
          <View className="gap-3 mb-12">
            <Text variant="h1" className="text-left">
              Predict the Future, Win Big
            </Text>
            <Text variant="lead" className="text-muted-foreground">
              Join predictions, vote with crypto, and climb leaderboards.
            </Text>
          </View>
          <Link href="/(auth)/auth" asChild>
            <Button className="h-12 rounded-xl">
              <Text className="text-lg">Get Started</Text>
            </Button>
          </Link>
        </View>
      </ImageBackground>
    </>
  );
}
