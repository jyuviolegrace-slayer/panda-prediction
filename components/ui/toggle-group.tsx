import * as React from 'react';
import { View } from 'react-native';
import { Button } from './button';
import { Text } from './text';
import { cn } from '@/lib/utils';

export type ToggleOption<T extends string = string> = {
  label: string;
  value: T;
};

export type ToggleGroupProps<T extends string = string> = {
  options: ToggleOption<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
};

function ToggleGroup<T extends string>({ options, value, onChange, className }: ToggleGroupProps<T>) {
  return (
    <View className={cn('flex-row rounded-xl border border-input p-1 bg-input/20', className)}>
      {options.map(opt => {
        const selected = opt.value === value;
        return (
          <Button
            key={opt.value}
            onPress={() => onChange(opt.value)}
            variant={selected ? 'default' : 'ghost'}
            className={cn('flex-1 h-10 rounded-lg', selected ? 'bg-blue-600' : '')}
          >
            <Text className={cn(selected ? 'text-white' : 'text-muted-foreground')}>{opt.label}</Text>
          </Button>
        );
      })}
    </View>
  );
}

export { ToggleGroup };
