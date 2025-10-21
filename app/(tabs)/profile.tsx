import * as React from 'react';
import { Image, View, Pressable, Share, Linking, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useStore } from '@/lib/store';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { GradientView } from '@/components/ui/gradient-view';
import {
  Edit3,
  Settings as SettingsIcon,
  Share2,
  Twitter,
  Instagram,
  Facebook,
  Play,
} from 'lucide-react-native';
import { getUserStatsRemote } from '@/lib/repositories/users';

export default function ProfileScreen() {
  const { user, logout, setUser } = useStore();

  React.useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const stats = await getUserStatsRemote(user.username);
        if (stats) {
          setUser({ ...user, stats });
        }
      } catch {}
    })();
  }, [setUser, user]);

  const onOpenTwitter = React.useCallback(async () => {
    if (!user?.twitter) return;
    const handle = user.twitter.startsWith('@') ? user.twitter.slice(1) : user.twitter;
    const url = `https://twitter.com/${handle}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch {}
  }, [user?.twitter]);

  const onShare = React.useCallback(async () => {
    if (!user) return;
    try {
      await Share.share({
        message: `Check out ${user.username} on Predict — ${user.twitter}`,
        url: `https://predict.app/u/${encodeURIComponent(user.username)}`,
      });
    } catch {}
  }, [user]);

  if (!user) return null;

  return (
    <>
      <Stack.Screen options={{ title: 'Profile' }} />
      <View className="flex-1 bg-background">
        {/* Banner */}
        <View className="relative">
          <Image
            source={{
              uri:
                // If we later add user.banner, prefer it; for now use a high-contrast fallback
                'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop',
            }}
            className="h-48 w-full"
          />
          {/* Overlay for contrast */}
          <View className="absolute inset-0 bg-black/25" />

          {/* Action icons */}
          <View className="absolute right-4 top-4 flex-row gap-2">
            <Pressable
              onPress={onShare}
              className="items-center justify-center rounded-full bg-black/40 p-2"
              accessibilityLabel="Share profile">
              <Icon as={Share2} size={18} className="text-white" />
            </Pressable>
            <Pressable
              onPress={() => {}}
              className="items-center justify-center rounded-full bg-black/40 p-2"
              accessibilityLabel="Profile settings">
              <Icon as={SettingsIcon} size={18} className="text-white" />
            </Pressable>
          </View>

          {/* Avatar */}
          <View className="absolute -bottom-10 left-6">
            <Avatar
              source={{ uri: user.avatar }}
              size={92}
              className="border-2 border-background"
            />
          </View>
        </View>

        {/* Header content */}
        <View className="mt-14 px-6">
          <Text variant="h3" className="font-semibold">
            {user.username}
          </Text>
          <Pressable onPress={onOpenTwitter} className="mt-1 flex-row items-center gap-2">
            <Icon as={Twitter} size={16} className="text-primary" />
            <Text className="text-primary">{user.twitter}</Text>
          </Pressable>

          {/* Quick actions */}
          <View className="mt-4 flex-row gap-3">
            <Button variant="outline" className="rounded-xl px-4">
              <Icon as={Edit3} size={16} />
              <Text>Edit Profile</Text>
            </Button>
            <Button variant="secondary" className="rounded-xl px-4" onPress={onShare}>
              <Icon as={Share2} size={16} />
              <Text>Share</Text>
            </Button>
          </View>
        </View>

        {/* Stats */}
        <View className="mt-6 px-6">
          <View className="flex-row gap-3">
            <Card className="flex-1 items-center py-4">
              <Text className="text-muted-foreground">Votes</Text>
              <Text variant="large" className="font-semibold">
                {user.stats.votes}
              </Text>
            </Card>
            <Card className="flex-1 items-center py-4">
              <Text className="text-muted-foreground">Accuracy</Text>
              <Text variant="large" className="font-semibold">
                {user.stats.accuracy}%
              </Text>
            </Card>
            <Card className="flex-1 items-center py-4">
              <Text className="text-muted-foreground">Winnings</Text>
              <Text variant="large" className="font-semibold">
                {user.stats.winnings} USDC
              </Text>
            </Card>
          </View>
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
