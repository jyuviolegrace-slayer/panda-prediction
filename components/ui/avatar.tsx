import * as React from 'react';
import { Image, View } from 'react-native';
import { cn } from '@/lib/utils';

export type AvatarProps = React.ComponentProps<typeof Image> & {
  size?: number;
};

function Avatar({ size = 40, className, style, ...props }: AvatarProps) {
  return (
    <Image
      {...props}
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      className={cn('bg-muted', className)}
    />
  );
}

export { Avatar };
