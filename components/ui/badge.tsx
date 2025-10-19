import * as React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/utils';

export type BadgeProps = React.ComponentProps<typeof View> & {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  textClassName?: string;
};

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-primary/10',
  secondary: 'bg-secondary',
  success: 'bg-green-600/20',
  warning: 'bg-yellow-600/20',
  destructive: 'bg-destructive/20',
  outline: 'bg-transparent border border-border',
};

function Badge({ className, textClassName, variant = 'secondary', children, ...props }: BadgeProps) {
  return (
    <View className={cn('px-2 py-1 rounded-full', variants[variant], className)} {...props}>
      <Text className={cn('text-xs text-foreground', textClassName)}>{children}</Text>
    </View>
  );
}

export { Badge };
