import * as React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { SearchIcon } from 'lucide-react-native';

export default function SearchScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Search' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 gap-4">
          {/* Search Bar */}
          <View className="flex-row items-center bg-[hsl(var(--input))] rounded-xl px-4 py-3 gap-3">
            <Icon as={SearchIcon} size={20} color="hsl(var(--muted-foreground))" />
            <Text className="flex-1 text-[hsl(var(--muted-foreground))]">
              Search predictions...
            </Text>
          </View>

          {/* Trending Section */}
          <View className="gap-3">
            <Text variant="h3" className="font-semibold">
              Trending
            </Text>
            
            {/* Featured Trending Card - matches the design */}
            <Card className="overflow-hidden">
              <View className="h-48 relative">
                {/* Placeholder for the gradient background */}
                <Image 
                  source={{ uri: 'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=Trending' }}
                  className="w-full h-full"
                  style={{ opacity: 0.8 }}
                />
                <View className="absolute bottom-4 left-4 right-4">
                  <Text className="text-white font-semibold text-lg mb-2">
                    Overload
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <Image 
                        source={{ uri: 'https://via.placeholder.com/24x24/4A90E2/FFFFFF?text=J' }}
                        className="w-6 h-6 rounded-full"
                      />
                      <Text className="text-white/90 text-sm">
                        Jailyn Crona
                      </Text>
                    </View>
                    <View className="bg-white/20 rounded-lg px-3 py-1">
                      <Text className="text-white text-sm font-medium">
                        Current bid
                      </Text>
                      <Text className="text-white font-bold">
                        1.00 ETH
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Card>

            {/* Second Trending Card */}
            <Card className="overflow-hidden">
              <View className="h-32 relative">
                <Image 
                  source={{ uri: 'https://via.placeholder.com/400x128/6B73FF/FFFFFF?text=Trending+2' }}
                  className="w-full h-full"
                  style={{ opacity: 0.9 }}
                />
                <View className="absolute bottom-3 left-3 right-3">
                  <Text className="text-white font-medium">
                    Crypto Market Prediction
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Popular Categories */}
          <View className="gap-3">
            <Text variant="h4" className="font-semibold">
              Popular Categories
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {['Crypto', 'Sports', 'Politics', 'Tech', 'Entertainment', 'Weather'].map((category) => (
                <View 
                  key={category}
                  className="bg-[hsl(var(--secondary))] rounded-full px-4 py-2"
                >
                  <Text className="text-[hsl(var(--secondary-foreground))] text-sm">
                    {category}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Searches */}
          <View className="gap-3">
            <Text variant="h4" className="font-semibold">
              Recent Searches
            </Text>
            <View className="gap-2">
              {['Bitcoin price prediction', 'Election results', 'Weather forecast'].map((search, index) => (
                <View key={index} className="flex-row items-center gap-3 py-2">
                  <Icon as={SearchIcon} size={16} color="hsl(var(--muted-foreground))" />
                  <Text className="text-[hsl(var(--muted-foreground))]">
                    {search}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}