import * as React from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, View } from 'react-native';
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
import { getAllPredictionsRemote, getPredictionsPageRemote } from '@/lib/repositories/predictions';

const PAGE_SIZE = 10;

export default function HomeScreen() {
  const { predictions, user, setPredictions } = useStore();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    (async () => {
      if (predictions.length === 0) {
        await onRefresh();
      } else {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = React.useCallback(async () => {
    try {
      setRefreshing(true);
      const page = await getPredictionsPageRemote(PAGE_SIZE, 0);
      if (page && page.items) {
        setPredictions(page.items);
        setOffset(page.items.length);
        setHasMore(page.count == null ? page.items.length === PAGE_SIZE : (page.items.length + 0) < (page.count || 0));
      } else {
        // Fallback to full fetch if pagination unsupported
        const remote = await getAllPredictionsRemote();
        if (remote) {
          setPredictions(remote);
          setOffset(remote.length);
          setHasMore(false);
        }
      }
    } finally {
      setRefreshing(false);
    }
  }, [setPredictions]);

  const loadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const page = await getPredictionsPageRemote(PAGE_SIZE, offset);
      if (page && page.items && page.items.length > 0) {
        // Dedup by id
        const existingIds = new Set(predictions.map(p => p.id));
        const merged = [...predictions];
        for (const it of page.items) {
          if (!existingIds.has(it.id)) merged.push(it);
        }
        setPredictions(merged);
        setOffset(offset + page.items.length);
        const totalCount = page.count ?? null;
        if (totalCount != null) {
          setHasMore(merged.length < totalCount);
        } else {
          setHasMore(page.items.length === PAGE_SIZE);
        }
      } else {
        setHasMore(false);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, offset, predictions, setPredictions]);

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
            onEndReachedThreshold={0.5}
            onEndReached={loadMore}
            ListFooterComponent={loadingMore ? (
              <View className="py-4 items-center">
                <ActivityIndicator />
              </View>
            ) : null}
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
