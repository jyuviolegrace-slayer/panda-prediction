import React from 'react';
import { FlatList, View } from 'react-native';
import { Stack } from 'expo-router';
import { Crown, Medal } from 'lucide-react-native';

import { useStore, type LeaderboardEntry } from '@/lib/store';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type LeaderboardFilter = 'today' | 'week' | 'all';

const FILTER_OPTIONS: { label: string; value: LeaderboardFilter }[] = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'All Time', value: 'all' },
];

export default function LeaderboardShowcaseScreen() {
  const { leaderboard } = useStore();
  const [filter, setFilter] = React.useState<LeaderboardFilter>('today');

  const data = leaderboard[filter] ?? [];
  const topThree = React.useMemo(() => data.slice(0, 3), [data]);
  const rest = React.useMemo(() => data.slice(3), [data]);

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        data={rest}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        ListHeaderComponent={() => (
          <LeaderboardHeader
            filter={filter}
            onFilterChange={setFilter}
            topThree={topThree}
            totalPlayers={data.length}
          />
        )}
        ListHeaderComponentStyle={{ marginBottom: 20 }}
        renderItem={({ item, index }) => <LeaderboardRow entry={item} rank={index + 4} />}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={
          rest.length === 0 ? (
            <Card className="mt-6 items-center justify-center bg-card/80 py-12">
              <Icon as={Crown} size={28} className="text-muted-foreground" />
              <Text className="mt-3 text-lg font-semibold text-foreground">No additional challengers yet</Text>
              <Text className="mt-2 text-center text-sm text-muted-foreground">
                As more predictors climb the ranks, they will appear in this list.
              </Text>
            </Card>
          ) : null
        }
      />
    </View>
  );
}

type LeaderboardHeaderProps = {
  filter: LeaderboardFilter;
  onFilterChange: (value: LeaderboardFilter) => void;
  topThree: LeaderboardEntry[];
  totalPlayers: number;
};

function LeaderboardHeader({ filter, onFilterChange, topThree, totalPlayers }: LeaderboardHeaderProps) {
  const headline = React.useMemo(() => {
    switch (filter) {
      case 'today':
        return 'Today’s most accurate predictors.';
      case 'week':
        return 'This week’s standout performers.';
      case 'all':
      default:
        return 'All-time legends of the prediction market.';
    }
  }, [filter]);

  const topScore = topThree[0]?.score ?? 0;

  return (
    <View className="pt-12">
      <View className="mb-8">
        <Text className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Global standings</Text>
        <Text className="mt-3 text-4xl font-semibold text-foreground">Leaderboard</Text>
        <Text className="mt-4 text-sm leading-6 text-muted-foreground">{headline}</Text>
      </View>

      <ToggleGroup options={FILTER_OPTIONS} value={filter} onChange={onFilterChange} className="mb-6" />

      <Card className="bg-card/80 p-6">
        <View className="flex-row items-end justify-between gap-4">
          <Podium entry={topThree[1]} rank={2} height={96} />
          <Podium entry={topThree[0]} rank={1} height={132} highlight />
          <Podium entry={topThree[2]} rank={3} height={80} />
        </View>
      </Card>

      <View className="mt-6 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-semibold text-muted-foreground">Total competitors</Text>
          <Text className="mt-1 text-2xl font-semibold text-foreground">{totalPlayers}</Text>
        </View>
        <View className="items-end">
          <Text className="text-sm font-semibold text-muted-foreground">Top score</Text>
          <Text className="mt-1 text-2xl font-semibold text-primary">{formatScore(topScore)}</Text>
        </View>
      </View>

      <Separator className="mt-6" />

      <Text className="mt-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">Ranks 4 and below</Text>
    </View>
  );
}

type PodiumProps = {
  entry?: LeaderboardEntry;
  rank: 1 | 2 | 3;
  height: number;
  highlight?: boolean;
};

function Podium({ entry, rank, height, highlight }: PodiumProps) {
  if (!entry) {
    return (
      <View className={cn('items-center', highlight ? 'flex-[1.2]' : 'flex-1')}>
        <View className="size-20 rounded-full bg-muted/40" />
        <View className="mt-4 h-3 w-16 rounded-full bg-muted/40" />
        <View className="mt-2 h-3 w-20 rounded-full bg-muted/30" />
        <View className="mt-4 w-full rounded-2xl bg-muted/30" style={{ height }} />
      </View>
    );
  }

  const pedestalClass = (() => {
    switch (rank) {
      case 1:
        return 'bg-primary/90';
      case 2:
        return 'bg-muted/80';
      case 3:
      default:
        return 'bg-amber-700/70';
    }
  })();

  const textClass = rank === 1 ? 'text-primary-foreground' : 'text-white';
  const usernameColor = rank === 1 ? 'text-primary' : 'text-foreground';

  return (
    <View className={cn('items-center', highlight ? 'flex-[1.2]' : 'flex-1')}>
      <View className="relative items-center">
        <Avatar
          size={highlight ? 92 : 76}
          source={{ uri: entry.avatar }}
          className={cn('border-2 border-border/40', rank === 1 ? 'border-primary/60' : '')}
        />
        <View className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 p-1.5">
          {rank === 1 ? (
            <Icon as={Crown} size={20} className="text-primary" />
          ) : (
            <Icon as={Medal} size={18} className={rank === 2 ? 'text-slate-300' : 'text-amber-400'} />
          )}
        </View>
      </View>

      <Text className={cn('mt-4 text-sm font-semibold', usernameColor)} numberOfLines={1}>
        {entry.username}
      </Text>
      <Text className="text-xs text-muted-foreground">{rank === 1 ? 'Champion' : rank === 2 ? 'Runner up' : 'Top three'}</Text>

      <View className={cn('mt-4 w-full items-center justify-end rounded-2xl px-3 py-3', pedestalClass)} style={{ height }}>
        <Text className={cn('text-sm font-semibold', textClass)}>{formatScore(entry.score)} pts</Text>
      </View>
    </View>
  );
}

type LeaderboardRowProps = {
  entry: LeaderboardEntry;
  rank: number;
};

function LeaderboardRow({ entry, rank }: LeaderboardRowProps) {
  return (
    <Card className="flex-row items-center gap-4 bg-card/90 p-5">
      <View className="items-center justify-center rounded-xl bg-muted/60 px-3 py-2">
        <Text className="text-lg font-semibold text-foreground">{rank}</Text>
      </View>
      <Avatar size={52} source={{ uri: entry.avatar }} className="border border-border/40" />
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
          {entry.username}
        </Text>
        <Text className="mt-1 text-xs text-muted-foreground" numberOfLines={1}>
          {formatScore(entry.score)} pts total
        </Text>
      </View>
      <Badge variant="outline" className="rounded-lg border-border/60 bg-transparent px-3 py-1" textClassName="text-xs text-muted-foreground">
        {rank <= 10 ? 'Top 10' : 'Challenger'}
      </Badge>
    </Card>
  );
}

function formatScore(score?: number) {
  if (score == null || Number.isNaN(score)) return '0';
  if (score >= 1_000_000) {
    return `${trimTrailingZero((score / 1_000_000).toFixed(1))}M`;
  }
  if (score >= 1_000) {
    return `${trimTrailingZero((score / 1_000).toFixed(1))}K`;
  }
  if (Number.isInteger(score)) {
    return String(score);
  }
  const precision = score < 10 ? 2 : 1;
  return trimTrailingZero(score.toFixed(precision));
}

function trimTrailingZero(value: string) {
  return value.replace(/\.0$/, '');
}
