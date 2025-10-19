import { Redirect } from 'expo-router';
import * as React from 'react';
import { useStore } from '@/lib/store';

export default function Index() {
  const { user } = useStore();
  return <Redirect href={user ? '/(tabs)/home' : '/(auth)/landing'} />;
}
