import * as React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useStore, type Comment } from '@/lib/store';
import { Text } from '@/components/ui/text';
import { Avatar } from '@/components/ui/avatar';
import { CardInput } from '@/components/ui/card-input';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 20;

export default function CommentsListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { predictions, addComment, user } = useStore();
  const prediction = predictions.find((p) => p.id === id);

  const [visible, setVisible] = React.useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [commentText, setCommentText] = React.useState('');

  if (!prediction) return null;

  const data = prediction.comments.slice(0, visible);
  const hasMore = visible < prediction.comments.length;

  const loadMore = React.useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisible((v) => Math.min(v + PAGE_SIZE, prediction.comments.length));
      setLoadingMore(false);
    }, 200);
  }, [hasMore, loadingMore, prediction.comments.length]);

  function submitComment() {
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
    // Ensure new comment is visible
    setVisible((v) => v + 1);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Comments' }} />
      <View className="flex-1 bg-background p-4">
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="h-px bg-border" />}
          renderItem={({ item }) => (
            <View className="flex-row gap-3 py-3">
              <Avatar source={{ uri: item.user.avatar }} size={32} />
              <View className="flex-1">
                <Text className="font-semibold">{item.user.username}</Text>
                <Text className="text-muted-foreground">{item.text}</Text>
              </View>
            </View>
          )}
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          ListFooterComponent={loadingMore ? (
            <View className="py-4 items-center">
              <ActivityIndicator />
            </View>
          ) : null}
          ListEmptyComponent={() => (
            <View className="items-center py-10">
              <Text className="text-muted-foreground">No comments yet</Text>
            </View>
          )}
        />
        <View className="mt-2 flex-row items-center gap-2">
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
    </>
  );
}
