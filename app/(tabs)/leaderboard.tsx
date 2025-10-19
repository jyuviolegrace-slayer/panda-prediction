import * as React from 'react';
import { FlatList, View, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useStore } from '@/lib/store';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function LeaderboardScreen() {
  const { leaderboard } = useStore();
  const [filter, setFilter] = React.useState<'today' | 'week' | 'all'>('today');

  const data = leaderboard[filter];
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <>
      <Stack.Screen options={{ title: 'Leaderboard' }} />
      <View className="flex-1 bg-background p-4">
        <ToggleGroup
          options={[
            { label: 'Today', value: 'today' },
            { label: 'Week', value: 'week' },
            { label: 'All Time', value: 'all' },
          ]}
          value={filter}
          onChange={v => setFilter(v)}
          className="mb-4"
        />
        <View className="flex-row gap-3 mb-4">
          {top3.map((u, idx) => (
            <Card key={u.id} className="flex-1 items-center py-4">
              <Image source={{ uri: u.avatar }} className="h-16 w-16 rounded-full mb-2" />
              <Text className="font-semibold">{u.username}</Text>
              <Badge
                variant={idx === 0 ? 'warning' : idx === 1 ? 'secondary' : 'destructive'}
                className="mt-2"
              >
                {idx === 0 ? '1st' : idx === 1 ? '2nd' : '3rd'} • {u.score} pts
              </Badge>
            </Card>
          ))}
        </View>
        <Separator className="my-2" />
        <FlatList
          data={rest}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <Separator className="my-2" />}
          renderItem={({ item, index }) => (
            <View className="flex-row items-center gap-3">
              <Text className="w-8 text-muted-foreground">{index + 4}</Text>
              <Image source={{ uri: item.avatar }} className="h-10 w-10 rounded-full" />
              <View className="flex-1">
                <Text>{item.username}</Text>
              </View>
              <Text className="text-muted-foreground">{item.score} pts</Text>
            </View>
          )}
        />
      </View>
    </>
  );
}
