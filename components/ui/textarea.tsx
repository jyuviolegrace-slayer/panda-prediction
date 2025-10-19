import * as React from 'react';
import { TextInput } from 'react-native';
import { cn } from '@/lib/utils';

export type TextAreaProps = React.ComponentProps<typeof TextInput>;

function TextArea({ className, style, ...props }: TextAreaProps) {
  return (
    <TextInput
      multiline
      placeholderTextColor="#888"
      className={cn(
        'min-h-24 rounded-xl border border-input bg-transparent p-3 text-foreground',
        className
      )}
      style={style}
      {...props}
    />
  );
}

export { TextArea };
