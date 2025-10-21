import * as React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/lib/utils';

export type BadgeProps = React.ComponentProps<typeof View> & {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  textClassName?: string;
};

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-primary/10',
  secondary: 'bg-[#8E33FF]',
  success: 'bg-[#118D57]',
  warning: 'bg-yellow-600/20',
  destructive: 'bg-destructive/20',
  outline: 'bg-transparent border border-border',
};

function Badge({
  className,
  textClassName,
  variant = 'secondary',
  children,
  ...props
}: BadgeProps) {
  return (
    <View className={cn('rounded-full px-2 py-1', variants[variant], className)} {...props}>
      <Text className={cn('text-xs text-foreground', textClassName)}>{children}</Text>
    </View>
  );
}

export { Badge };
