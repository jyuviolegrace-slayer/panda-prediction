import * as React from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useStore, type Comment } from '@/lib/store';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import { CardInput } from '@/components/ui/card-input';
import { Separator } from '@/components/ui/separator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function useCountdown(endMs: number) {
  const [remaining, setRemaining] = React.useState(endMs - Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setRemaining(endMs - Date.now()), 1000);
    return () => clearInterval(t);
  }, [endMs]);
  const hours = Math.max(0, Math.floor(remaining / 3600000));
  const minutes = Math.max(0, Math.floor((remaining % 3600000) / 60000));
  return `${hours}h ${minutes}m`;
}

function CustomHeader({
  title,
  author,
}: {
  title: string;
  author: { username: string; avatar: string };
}) {
  const insets = useSafeAreaInsets();

  return (
    <View className="px-4 pb-4" style={{ paddingTop: insets.top + 16 }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="mb-2 text-2xl font-bold text-white">{title}</Text>
          <View className="flex-row items-center gap-2">
            <Avatar source={{ uri: author.avatar }} size={24} />
            <Text className="text-base text-white">{author.username}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-700">
          <Text className="text-lg font-bold text-white">×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PredictionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { predictions, user, addComment } = useStore();
  const prediction = predictions.find((p) => p.id === id);

  if (!prediction) return null;

  const endTime = new Date(prediction.createdAt).getTime() + prediction.duration;
  const remaining = useCountdown(endTime);

  const [commentText, setCommentText] = React.useState('');
  function submitComment() {
    if (!prediction) return;
    const text = commentText.trim();
    if (!text) return;
    const newComment: Comment = {
      id: Math.random().toString(36).slice(2, 9),
      user: {
        username: user?.username || 'anon',
        avatar: user?.avatar || 'https://i.pravatar.cc/150?img=66',
      },
      text,
      timestamp: Date.now(),
    };
    addComment(prediction.id, newComment);
    setCommentText('');
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Prediction', headerShown: false }} />
      <CustomHeader title={prediction.title} author={prediction.author} />
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 24 }}>
        {prediction.thumbnail && (
          <Image source={{ uri: prediction.thumbnail }} className="h-56 w-full" />
        )}
        <View className="gap-3 p-4">
          <Text variant="h3">{prediction.title}</Text>
          <View className="flex-row gap-2">
            <Badge variant="success">Pool: {prediction.pool.toFixed(2)} USDC</Badge>
            <Badge variant="secondary">Votes: {prediction.votes}</Badge>
          </View>
          <Text className="text-muted-foreground">Ends in {remaining}</Text>

          <Separator className="my-3" />

          <Text variant="h4" className="mb-2">
            Options
          </Text>
          <View className="gap-3">
            {prediction.options.map((opt) => (
              <OptionRow
                key={opt.id}
                predictionId={prediction.id}
                optionId={opt.id}
                label={opt.label}
                image={opt.image}
              />
            ))}
          </View>

          <Separator className="my-4" />

          <View className="gap-2">
            <Text variant="h4">Top Voters</Text>
            <View className="flex-row gap-2">
              {prediction.topVoters.map((v, i) => (
                <Avatar key={i} source={{ uri: v.avatar }} size={36} />
              ))}
            </View>
          </View>

          <Separator className="my-4" />

          <View className="flex-row items-center gap-3">
            <Avatar source={{ uri: prediction.author.avatar }} size={40} />
            <View>
              <Text className="font-semibold">{prediction.author.username}</Text>
              <Text className="text-primary">{prediction.author.twitter}</Text>
            </View>
          </View>

          <Separator className="my-4" />

          <Text variant="h4" className="mb-2">
            Comments
          </Text>
          <FlatList
            data={prediction.comments.slice(0, 3)}
            keyExtractor={(c) => c.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View className="flex-row gap-3 py-3">
                <Avatar source={{ uri: item.user.avatar }} size={32} />
                <View className="flex-1">
                  <Text className="font-semibold">{item.user.username}</Text>
                  <Text className="text-muted-foreground">{item.text}</Text>
                </View>
              </View>
            )}
          />
          {prediction.comments.length > 3 ? (
            <Button
              variant="ghost"
              onPress={() => router.push(`/prediction/${prediction.id}/comments`)}>
              <Text>View all comments ({prediction.comments.length})</Text>
            </Button>
          ) : null}
          <View className="mt-3 flex-row items-center gap-2">
            <CardInput
              className="flex-1"
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <Button onPress={submitComment}>
              <Text>Post</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function OptionRow({
  predictionId,
  optionId,
  label,
  image,
}: {
  predictionId: string;
  optionId: string;
  label: string;
  image?: string | null;
}) {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        className="rounded-xl border border-input p-3">
        <Text className="font-medium">{label}</Text>
        {image && <Image source={{ uri: image }} className="mt-2 h-32 w-full rounded-lg" />}
      </Pressable>
      <VoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        predictionId={predictionId}
        optionId={optionId}
      />
    </>
  );
}

function VoteModal({
  visible,
  onClose,
  predictionId,
  optionId,
}: {
  visible: boolean;
  onClose: () => void;
  predictionId: string;
  optionId: string;
}) {
  const { voteOnPrediction } = useStore();
  const [amount, setAmount] = React.useState<'0.5' | '1' | '5' | 'Custom'>('1');
  const [custom, setCustom] = React.useState('');
  const [error, setError] = React.useState('');

  const submit = () => {
    const val = amount === 'Custom' ? Number(custom) : Number(amount);
    if (!val || val <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    voteOnPrediction(predictionId, optionId, val);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-end bg-background/60">
        <View className="w-full rounded-t-2xl bg-card p-4">
          <Text variant="h4" className="mb-3">
            Place your vote
          </Text>
          <RadioGroup
            options={[
              { label: '0.5 USDC', value: '0.5' },
              { label: '1 USDC', value: '1' },
              { label: '5 USDC', value: '5' },
              { label: 'Custom', value: 'Custom' },
            ]}
            value={amount}
            onChange={setAmount as any}
          />
          {amount === 'Custom' && (
            <CardInput
              placeholder="Enter amount"
              keyboardType="decimal-pad"
              value={custom}
              onChangeText={setCustom}
              className="mt-2"
            />
          )}
          {error ? <Text className="mt-2 text-destructive">{error}</Text> : null}
          <View className="mt-4 flex-row gap-2">
            <Button variant="outline" className="flex-1" onPress={onClose}>
              <Text>Cancel</Text>
            </Button>
            <Button className="flex-1" onPress={submit}>
              <Text>Confirm</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
