import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StoreProvider } from '@/lib/store';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider value={NAV_THEME.dark}>
      <StatusBar style="light" />
      <StoreProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: NAV_THEME.dark.colors.card },
            headerTintColor: NAV_THEME.dark.colors.text,
            contentStyle: { backgroundColor: NAV_THEME.dark.colors.background },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="create-vote" options={{ presentation: 'modal', title: 'Create Vote' }} />
          <Stack.Screen name="prediction/[id]" options={{ title: 'Prediction' }} />
        </Stack>
        <PortalHost />
      </StoreProvider>
    </ThemeProvider>
  );
}
