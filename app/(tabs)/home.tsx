import * as React from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { useStore } from '@/lib/store';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { PlusIcon } from 'lucide-react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllPredictionsRemote, upsertPredictionsLocal } from '@/lib/repositories/predictions';

export default function HomeScreen() {
  const { predictions, user, setPredictions } = useStore();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const onRefresh = React.useCallback(async () => {
    try {
      setRefreshing(true);
      const remote = await getAllPredictionsRemote();
      if (remote && remote.length) {
        upsertPredictionsLocal(remote);
        setPredictions(remote);
      }
    } finally {
      setRefreshing(false);
    }
  }, [setPredictions]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
          headerLeft: () => (
            <Pressable onPress={() => router.push('/(tabs)/profile')}>
              {user ? (
                <Avatar source={{ uri: user.avatar }} size={28} />
              ) : (
                <View className="size-7 rounded-full bg-muted" />
              )}
            </Pressable>
          ),
          headerRight: () => (
            <Button className="mr-2 rounded-full" onPress={() => router.push('/create-vote')}>
              <Icon as={PlusIcon} />
              <Text>Create Vote</Text>
            </Button>
          ),
        }}
      />
      <View className="flex-1 bg-background p-4">
        {loading ? (
          <View className="gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </View>
        ) : (
          <FlatList
            data={predictions}
            keyExtractor={item => item.id}
            contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
            renderItem={({ item }) => <PredictionCard item={item} />}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
    </>
  );
}

function PredictionCard({ item }: { item: ReturnType<typeof useStore>['predictions'][number] }) {
  return (
    <Pressable onPress={() => router.push(`/prediction/${item.id}`)}>
      <Card className="overflow-hidden">
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} className="h-40 w-full rounded-xl" />
        ) : null}
        <CardContent className="mt-3 gap-2">
          <Text variant="large" className="font-semibold">
            {item.title}
          </Text>
          <View className="flex-row items-center gap-2">
            <Badge variant="secondary">Votes: {item.votes}</Badge>
            <Badge variant="outline">Comments: {item.comments.length}</Badge>
            <Badge variant="success">Pool: {item.pool.toFixed(2)} USDC</Badge>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}
