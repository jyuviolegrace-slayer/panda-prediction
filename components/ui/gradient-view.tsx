import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface GradientViewProps extends ViewProps {
  colors?: string[];
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  className?: string;
}

export function GradientView({ 
  colors = ['#FF6B6B', '#4ECDC4'], 
  direction = 'diagonal',
  className,
  children,
  ...props 
}: GradientViewProps) {
  // For React Native, we'll use a simple colored background
  // In a real implementation, you'd use react-native-linear-gradient
  const gradientStyle = {
    backgroundColor: colors[0], // Fallback to first color
  };

  return (
    <View 
      className={cn('relative', className)}
      style={gradientStyle}
      {...props}
    >
      {children}
    </View>
  );
}