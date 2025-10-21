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
        setHasMore(
          page.count == null
            ? page.items.length === PAGE_SIZE
            : page.items.length + 0 < (page.count || 0)
        );
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
        const existingIds = new Set(predictions.map((p) => p.id));
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
            <Pressable
              style={{
                padding: 16,
              }}
              onPress={() => router.push('/(tabs)/profile')}>
              {user ? (
                <Avatar source={{ uri: user.avatar }} size={40} />
              ) : (
                <View className="size-10 rounded-full bg-muted" />
              )}
            </Pressable>
          ),
          // headerRight: () => (
          //   <Button className="mr-2 rounded-full" onPress={() => router.push('/create-vote')}>
          //     <Icon as={PlusIcon} />
          //     <Text>Create Vote</Text>
          //   </Button>
          // ),
        }}
      />
      <View className="flex-1 bg-background py-4">
        {loading ? (
          <View className="gap-4 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </View>
        ) : (
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => <PredictionCard item={item} />}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReachedThreshold={0.5}
            onEndReached={loadMore}
            // ListHeaderComponent={<TrendingSection />}
            ItemSeparatorComponent={() => <View className="h-3" />}
            ListFooterComponent={
              loadingMore ? (
                <View className="items-center py-4">
                  <ActivityIndicator />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </>
  );
}

function TrendingSection() {
  return (
    <View className="mb-6">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-foreground">Trending</Text>
        <Icon as={PlusIcon} className="text-muted-foreground" size={20} />
      </View>

      {/* Featured Trending Card - matches the design */}
      <Pressable onPress={() => console.log('Navigate to trending prediction')}>
        <Card className="mb-3 overflow-hidden">
          <View className="relative h-48">
            {/* Gradient background simulation */}
            <View
              className="absolute h-full w-full"
              style={{
                backgroundColor: '#FF6B6B',
                // backgroundColor: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
              }}
            />
            {/* Overlay for better text readability */}
            <View className="absolute inset-0 bg-black/20" />
            <View className="absolute bottom-4 left-4 right-4">
              <Text className="mb-2 text-xl font-semibold text-white">Overload</Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                    <Text className="text-xs font-bold text-white">J</Text>
                  </View>
                  <Text className="text-sm text-white/90">Jailyn Crona</Text>
                </View>
                <View className="rounded-lg bg-white/20 px-3 py-1">
                  <Text className="text-xs text-white/80">Current bid</Text>
                  <Text className="text-sm font-bold text-white">1.00 ETH</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>
      </Pressable>

      {/* Second Trending Card */}
      <Pressable onPress={() => console.log('Navigate to second trending prediction')}>
        <Card className="overflow-hidden">
          <View className="relative h-32">
            {/* Different gradient background simulation */}
            <View
              className="absolute h-full w-full"
              style={{
                backgroundColor: '#9B59B6',
                // background: 'linear-gradient(135deg, #9B59B6 0%, #3498DB 100%)',
              }}
            />
            {/* Overlay for better text readability */}
            <View className="absolute inset-0 bg-black/20" />
            <View className="absolute bottom-3 left-4 right-4">
              <Text className="text-lg font-semibold text-white">AI Revolution</Text>
            </View>
          </View>
        </Card>
      </Pressable>
    </View>
  );
}

function PredictionCard({ item }: { item: ReturnType<typeof useStore>['predictions'][number] }) {
  return (
    <Pressable onPress={() => router.push(`/prediction/${item.id}`)}>
      <Card className="mx-4 overflow-hidden">
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
