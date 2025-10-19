import * as React from 'react';
import { TextInput } from 'react-native';
import { cn } from '@/lib/utils';

export type CardInputProps = React.ComponentProps<typeof TextInput> & {
  error?: string;
};

function CardInput({ className, error, ...props }: CardInputProps) {
  return (
    <TextInput
      placeholderTextColor="#888"
      className={cn(
        'h-12 rounded-xl border border-input bg-transparent px-3 text-foreground',
        error && 'border-destructive',
        className
      )}
      {...props}
    />
  );
}

export { CardInput };
