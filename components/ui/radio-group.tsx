import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from './text';
import { cn } from '@/lib/utils';

export type RadioOption<T extends string = string> = {
  label: string;
  value: T;
};

export type RadioGroupProps<T extends string = string> = {
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

function RadioGroup<T extends string>({ options, value, onChange, className }: RadioGroupProps<T>) {
  return (
    <View className={cn('gap-2', className)}>
      {options.map(opt => (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          className={cn(
            'flex-row items-center justify-between rounded-xl border border-input px-3 py-3',
            value === opt.value && 'border-blue-500'
          )}
        >
          <Text>{opt.label}</Text>
          <View
            className={cn(
              'size-5 items-center justify-center rounded-full border border-input',
              value === opt.value && 'border-blue-500'
            )}
          >
            <View className={cn('size-2 rounded-full', value === opt.value ? 'bg-blue-500' : 'bg-transparent')} />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

export { RadioGroup };
