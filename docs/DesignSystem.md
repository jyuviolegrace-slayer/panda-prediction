# Design System Documentation

Predict — Dark-Only Mobile Design System (Airbnb-inspired)

Version: v0.1 (MVP)

Principles
- Dark-first and dark-only: reduce eye strain, improve contrast for media
- Minimalist and modern: generous spacing, rounded corners, subtle elevation
- Legible and calm: strong hierarchy, restrained color, consistent rhythm (8pt grid)
- Accessible by default: color contrast ≥ 4.5:1, touch targets ≥ 44px, screen reader labels


## 1. Brand & Visual Language
- Tone: confident, social, data-driven
- Shapes: soft, rounded corners; cards and modals have smooth radii
- Motion: quick and subtle; avoid excessive animations


## 2. Color System (Dark Theme Only)
Base palette
- Background: #000000
- Surface/Card: #0B0B0B
- Muted: #121212
- Border: #1E1E1E
- Text (Primary): #FFFFFF
- Text (Secondary): #B3B3B3
- Primary (Accent/Twitter Blue): #1DA1F2
- Success: #22C55E
- Warning: #F59E0B
- Destructive/Error: #EF4444

State overlays
- Overlay backdrop: rgba(0, 0, 0, 0.6)
- Focus ring: rgba(29, 161, 242, 0.5)

Semantic tokens
- bg = #000000
- card = #0B0B0B
- muted = #121212
- border = #1E1E1E
- primary = #1DA1F2
- primary-foreground = #000000
- text = #FFFFFF
- text-muted = #B3B3B3
- success = #22C55E
- warning = #F59E0B
- error = #EF4444


### 2.1 React Navigation + App Theme Configuration
```ts
// lib/theme.dark.ts
import { DarkTheme as NavDarkTheme, type Theme } from '@react-navigation/native';

export const AppDarkTheme: Theme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    background: '#000000',
    card: '#0B0B0B',
    border: '#1E1E1E',
    text: '#FFFFFF',
    primary: '#1DA1F2',
    notification: '#EF4444',
  },
};

export const TOKENS = {
  colors: {
    bg: '#000000',
    card: '#0B0B0B',
    muted: '#121212',
    border: '#1E1E1E',
    text: '#FFFFFF',
    textMuted: '#B3B3B3',
    primary: '#1DA1F2',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  radii: { xs: 8, sm: 12, md: 16, lg: 20, xl: 28, full: 999 },
  spacing: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 32, 8: 40, 9: 48 },
  opacity: { disabled: 0.5 },
};
```


## 3. Typography
System fonts (no custom install required in MVP):
- iOS: SF Pro Text / SF Pro Display
- Android: Roboto
- Web (if applicable): Inter, system UI fallback

Type scale (line-height ~1.2–1.4 of font size)
- Display: 32/36
- H1: 28/32
- H2: 24/28
- H3: 20/24
- H4: 18/24
- Body Large: 16/22
- Body: 14/20
- Caption: 12/16
- Overline: 10/14 (sparingly)

Usage
- Titles: H3/H4 in cards and lists; H1/H2 in screens and modals
- Body: default 14/16 for dense lists; 16 for forms and dialogs
- Emphasis: use weight, not color; avoid underlines unless link


## 4. Spacing, Layout, and Radii
- Grid: 8pt base; compose with 4pt when necessary for visual balance
- Spacing tokens: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48
- Component radii: buttons 12, inputs 12, cards 16, modals 20+, avatars full
- Layout: generous vertical rhythm; consistent padding (16) and card gaps (12)

Elevation & Shadows (subtle in dark)
- Card: shadowColor #000, opacity 0.3, radius 8
- Floating: backdrop blur or overlay 0.6


## 5. Iconography
- Library: @expo/vector-icons (Feather, Ionicons) or lucide-react-native
- Size: 20, 24 for inline; 28–32 for headers
- Color: default text-muted; primary for critical CTAs
- Avatar: user profile photo; fallback to initials or placeholder


## 6. Component Library (reactnativereusables)
The project prioritizes @react-native-reusables — a composable UI kit similar to shadcn/ui. Add components via CLI:

```
pnpm dlx @react-native-reusables/cli@latest add button card avatar badge text textarea radio-group select dialog dropdown sheet tabs toggle-group tooltip skeleton progress switch separator popover
```

Note: The existing template includes compatible primitives. New components should follow the same API and styling.

### 6.1 Button
Variants: primary (default), secondary, outline, ghost, destructive
Sizes: sm, md, lg, icon

```tsx
import { Button, Text } from 'reactnativereusables';

<Button variant="primary" size="md" onPress={onPress}>
  <Text>Launch</Text>
</Button>

<Button variant="secondary" size="sm">
  <Text>Add option</Text>
</Button>

<Button variant="icon" aria-label="Create">
  <Icon name="plus" size={20} color="#fff" />
</Button>
```

Guidelines
- Min width for tappable buttons 44px height
- Primary uses #1DA1F2 on #000 background; focus ring 2px

### 6.2 Card
```tsx
import { Card, CardContent, Text } from 'reactnativereusables';

<Card>
  <CardContent>
    <Text variant="h4">Will BTC hit $75k?</Text>
    <Text variant="muted">Pool: 250 USDC • 123 votes</Text>
  </CardContent>
</Card>
```

### 6.3 Avatar
```tsx
import { Avatar } from 'reactnativereusables';

<Avatar size={32} source={{ uri: avatarUrl }} />
```

Using Supabase Storage URLs
```tsx
import { supabase } from '@/lib/supabase';

const { data } = supabase.storage.from('avatars').getPublicUrl(path);
<Avatar size={32} source={{ uri: data.publicUrl }} />
```

### 6.4 Text
```tsx
<Text variant="h3" weight="600">Prediction Title</Text>
<Text variant="muted">Ends in 12h</Text>
```

### 6.5 Inputs (TextArea, CardInput), Radio Group, Select
```tsx
<TextArea placeholder="What do you want people to predict?" />

<RadioGroup
  options={[{ label: '24h', value: '24' }, { label: '12h', value: '12' }, { label: '1h', value: '1' }]}
  value={duration}
  onChange={setDuration}
/>
```

### 6.6 Dialog / Modal
- Use for vote amount confirmation
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Content>
    <Text variant="h4">Enter Amount</Text>
    {/* presets and custom input */}
    <Button onPress={confirm}>Confirm</Button>
  </Dialog.Content>
</Dialog>
```

### 6.7 Tabs
Used in Leaderboard filter and main bottom tabs (via navigation for bottom tabs).

### 6.8 Badge, Skeleton, Progress, Switch, Tooltip, Separator
- Badge: small inline status
- Skeleton: loading shimmer for lists and cards
- Progress: poll progress or option percentage bars
- Switch: settings and toggles in Create Vote


## 7. Patterns and Screens

### 7.1 Home Card Pattern
- Thumbnail (16px radius), title (H4, 600), meta row (badges for votes, comments, pool)
- Tap region opens details; long-press shows context menu (future)

```tsx
<Card>
  {thumbnail && <Image source={{ uri: thumbnail }} style={{ height: 160, borderRadius: 16 }} />}
  <CardContent>
    <Text variant="h4" weight="600">{title}</Text>
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Badge variant="secondary">Votes: {votes}</Badge>
      <Badge variant="outline">Comments: {comments}</Badge>
      <Badge variant="success">Pool: {pool.toFixed(2)} USDC</Badge>
    </View>
  </CardContent>
</Card>
```

### 7.2 Prediction Detail
- Large media, bold title, options as vertical selectable cards, countdown, pool, voters, comments list
- Voting opens modal with presets and custom input

### 7.3 Create Vote (Stepper)
- Step indicators (1/3), Next/Back buttons
- Image pickers upload to Supabase Storage
- Validation: question required; ≥2 options; duration selected; seed value >= 0

### 7.4 Leaderboard Rows
- Rank number, avatar, username, metric (e.g., winnings)
- Top 3 get special highlight (glow/badge)

### 7.5 Profile Header
- Banner image (edge-to-edge), avatar overlapping, username and handle, quick stats row


## 8. Accessibility
- Contrast: ≥ 4.5:1 for text on backgrounds; use text-muted for secondary copy but keep readable
- Touch targets: ≥ 44x44; avoid small tap areas
- Labels: All interactive components include accessibilityLabel/role
- Dynamic type: Respect system font scaling; truncate gracefully; avoid clipped text
- Motion: Reduce motion setting respected; no blocking animations


## 9. Theming Implementation Example (NativeWind/StyleSheet)
```tsx
// App provider setup (example)
import { NavigationContainer } from '@react-navigation/native';
import { AppDarkTheme } from '@/lib/theme.dark';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <NavigationContainer theme={AppDarkTheme}>{children}</NavigationContainer>;
}
```

Tailwind classes (Nativewind) mapping
- bg-background -> #000000
- bg-card -> #0B0B0B
- text-foreground -> #FFFFFF
- text-muted-foreground -> #B3B3B3
- border -> #1E1E1E
- primary -> #1DA1F2


## 10. Haptics & Feedback
- Light haptic on button press (important CTAs)
- Toasts for success/error (non-blocking)
- Skeletons for lists while loading; optimistic updates for comments/votes


## 11. Image & Media Guidelines
- Use high-resolution images with center-crop; target 1200w for large thumbnails
- Optimize uploads: quality ~0.8; JPEG/WEBP preferred
- Cache images where possible (expo-image provides caching on native)


## 12. Content & Copy
- Short, active phrases
- Avoid jargon; use numbers (e.g., "Pool: 250 USDC")
- Destructive actions require confirmation


## 13. Component Props Conventions
- onPress, disabled, loading across all clickable components
- variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
- size: 'sm' | 'md' | 'lg' | 'icon'
- className/style acceptance for flexibility


## 14. Example: Supabase Avatar Usage
```tsx
import { Image } from 'react-native';
import { supabase } from '@/lib/supabase';

export function ProfileAvatar({ path }: { path: string }) {
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return <Image source={{ uri: data.publicUrl }} style={{ width: 48, height: 48, borderRadius: 24 }} />;
}
```


## 15. Quality Bar
- Visual QA across iOS/Android devices (modern and mid-tier)
- No clipped text, truncated without ellipses when necessary
- 60fps interactions; no jank in lists


## 16. Roadmap for Design System
- Add light theme tokens (post-MVP if ever needed)
- Build chart primitives for percentages
- Add Toast, SnackBar, BottomSheet standard components
- Document custom hooks (e.g., useTheme, useHaptics)
