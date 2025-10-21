import * as React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { CardInput } from '@/components/ui/card-input';
import { TextArea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import { useStore, type Prediction } from '@/lib/store';
import { pickAndUploadImage } from '@/lib/supabase';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function CreateVoteScreen() {
  const { addPrediction, user } = useStore();
  const [step, setStep] = React.useState<1 | 2 | 3>(1);

  const [question, setQuestion] = React.useState('');
  const [options, setOptions] = React.useState<string[]>(['Option A', 'Option B']);
  const [socialEnabled, setSocialEnabled] = React.useState(false);
  const [coverEnabled, setCoverEnabled] = React.useState(false);
  const [imagesPerOption, setImagesPerOption] = React.useState(false);
  const [socialUrl, setSocialUrl] = React.useState('');
  const [coverImage, setCoverImage] = React.useState<string | null>(null);
  const [optionImages, setOptionImages] = React.useState<Record<number, string | null>>({});

  const [duration, setDuration] = React.useState<'24h' | '12h' | '1h'>('24h');
  const [token, setToken] = React.useState<'USDC' | 'Custom'>('USDC');
  const [customToken, setCustomToken] = React.useState('');
  const [seed, setSeed] = React.useState<'0.1' | '1' | '10' | 'Custom'>('0.1');
  const [customSeed, setCustomSeed] = React.useState('');

  const onAddOption = () =>
    setOptions((prev) => [...prev, `Option ${String.fromCharCode(65 + prev.length)}`]);

  const durationMs =
    duration === '24h' ? 24 * 3600000 : duration === '12h' ? 12 * 3600000 : 3600000;
  const seedValue = seed === 'Custom' ? Number(customSeed || 0) : Number(seed);

  const onLaunch = () => {
    const newPrediction: Prediction = {
      id: Math.random().toString(36).slice(2, 9),
      title: question || 'Untitled Prediction',
      thumbnail: coverImage,
      votes: 0,
      pool: seedValue || 0,
      comments: [],
      options: options.map((label, idx) => ({
        id: `o${idx + 1}`,
        label,
        image: optionImages[idx] || undefined,
        votes: 0,
      })),
      duration: durationMs,
      createdAt: new Date().toISOString(),
      author: user
        ? { username: user.username, avatar: user.avatar, twitter: user.twitter }
        : { username: 'anon', avatar: 'https://i.pravatar.cc/150?img=66', twitter: '@anon' },
      topVoters: [],
    };
    addPrediction(newPrediction);
    router.replace('/(tabs)/home');
  };

  async function onPickCover() {
    const url = await pickAndUploadImage('thumbnails', 'covers');
    if (url) setCoverImage(url);
  }

  async function onPickOption(idx: number) {
    const url = await pickAndUploadImage('option-images', 'options');
    if (url) setOptionImages((prev) => ({ ...prev, [idx]: url }));
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Create Vote' }} />
      <ScrollView
        className="flex-1 bg-background p-4"
        contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-muted-foreground">Step {step} of 3</Text>
          <View className="flex-row gap-2">
            {step > 1 && (
              <Button variant="outline" onPress={() => setStep((s) => (s - 1) as 1 | 2 | 3)}>
                <Text>Back</Text>
              </Button>
            )}
            {step < 3 && (
              <Button onPress={() => setStep((s) => (s + 1) as 1 | 2 | 3)}>
                <Text>Next</Text>
              </Button>
            )}
          </View>
        </View>

        {step === 1 && (
          <View className="gap-4">
            <Text variant="h4">Question</Text>
            <TextArea
              value={question}
              onChangeText={setQuestion}
              placeholder="What do you want people to predict?"
            />

            <Text variant="h4" className="mt-2">
              Options
            </Text>
            {options.map((opt, idx) => (
              <CardInput
                key={idx}
                value={opt}
                onChangeText={(t) => setOptions((prev) => prev.map((o, i) => (i === idx ? t : o)))}
              />
            ))}
            <Button variant="secondary" onPress={onAddOption}>
              <Text>Add another option</Text>
            </Button>

            <View className="mt-2 gap-3">
              <View className="flex-row items-center justify-between">
                <Label>Embed Social Post</Label>
                <Switch checked={socialEnabled} onCheckedChange={setSocialEnabled} />
              </View>
              {socialEnabled && (
                <CardInput
                  placeholder="https://twitter.com/..."
                  value={socialUrl}
                  onChangeText={setSocialUrl}
                />
              )}

              <View className="flex-row items-center justify-between">
                <Label>Cover Media</Label>
                <Switch checked={coverEnabled} onCheckedChange={setCoverEnabled} />
              </View>
              {coverEnabled && (
                <View className="gap-2">
                  <Button variant="outline" onPress={onPickCover}>
                    <Text>Upload cover</Text>
                  </Button>
                  {coverImage && (
                    <Image source={{ uri: coverImage }} className="h-40 w-full rounded-xl" />
                  )}
                </View>
              )}

              <View className="flex-row items-center justify-between">
                <Label>Images Per Option</Label>
                <Switch checked={imagesPerOption} onCheckedChange={setImagesPerOption} />
              </View>
              {imagesPerOption && (
                <View className="gap-2">
                  {options.map((_, idx) => (
                    <View className="gap-2" key={idx}>
                      <Button variant="outline" onPress={() => onPickOption(idx)}>
                        <Text>Upload image for option {idx + 1}</Text>
                      </Button>
                      {optionImages[idx] && (
                        <Image
                          source={{ uri: optionImages[idx]! }}
                          className="h-32 w-full rounded-xl"
                        />
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {step === 2 && (
          <View className="gap-4">
            <Text variant="h4">Select Duration</Text>
            <RadioGroup
              options={[
                { label: '24 hours', value: '24h' },
                { label: '12 hours', value: '12h' },
                { label: '1 hour', value: '1h' },
              ]}
              value={duration}
              onChange={setDuration}
            />

            <Text variant="h4" className="mt-2">
              Payment Token
            </Text>
            <RadioGroup
              options={[
                { label: 'USDC', value: 'USDC' },
                { label: 'Custom', value: 'Custom' },
              ]}
              value={token}
              onChange={setToken}
            />
            {token === 'Custom' && (
              <CardInput
                placeholder="Enter token symbol"
                value={customToken}
                onChangeText={setCustomToken}
              />
            )}

            <Text variant="h4" className="mt-2">
              Seed Pool
            </Text>
            <RadioGroup
              options={[
                { label: '0.1 USDC', value: '0.1' },
                { label: '1 USDC', value: '1' },
                { label: '10 USDC', value: '10' },
                { label: 'Custom', value: 'Custom' },
              ]}
              value={seed}
              onChange={setSeed}
            />
            {seed === 'Custom' && (
              <CardInput
                placeholder="Enter amount"
                keyboardType="decimal-pad"
                value={customSeed}
                onChangeText={setCustomSeed}
              />
            )}

            <Button onPress={() => setStep(3)} className="mt-2">
              <Text>Preview</Text>
            </Button>
          </View>
        )}

        {step === 3 && (
          <View className="gap-4">
            <Text variant="h4">Preview</Text>
            <Card>
              {coverImage && (
                <Image source={{ uri: coverImage }} className="h-40 w-full rounded-xl" />
              )}
              <CardContent className="mt-3 gap-2">
                <Text variant="large" className="font-semibold">
                  {question || 'Untitled Prediction'}
                </Text>
                <Text className="text-muted-foreground">Duration: {duration}</Text>
                <Text className="text-muted-foreground">
                  Token: {token === 'Custom' ? customToken || 'N/A' : 'USDC'}
                </Text>
                <Text className="text-muted-foreground">Seed Pool: {seedValue || 0} USDC</Text>
                <View className="mt-2 gap-2">
                  {options.map((opt, idx) => (
                    <View key={idx} className="rounded-xl border border-input p-3">
                      <Text>{opt}</Text>
                      {imagesPerOption && optionImages[idx] && (
                        <Image
                          source={{ uri: optionImages[idx]! }}
                          className="mt-2 h-32 w-full rounded-lg"
                        />
                      )}
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
            <Button onPress={onLaunch}>
              <Text>Launch</Text>
            </Button>
          </View>
        )}
      </ScrollView>
    </>
  );
}
