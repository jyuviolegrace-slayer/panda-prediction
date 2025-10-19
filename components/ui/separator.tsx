import * as React from 'react';
import { View } from 'react-native';
import { cn } from '@/lib/utils';

function Separator({ className, ...props }: React.ComponentProps<typeof View>) {
  return <View className={cn('h-px bg-border', className)} {...props} />;
}

export { Separator };
