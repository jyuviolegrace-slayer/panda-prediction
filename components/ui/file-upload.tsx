import * as React from 'react';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';
import { UploadCloud } from 'lucide-react-native';

import { pickAndUploadImage } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

interface FileUploadProps {
  bucket: string;
  pathPrefix: string;
  value: string | null;
  onChange: (url: string | null) => void;
  title?: string;
  description?: string;
  buttonLabel?: string;
  changeLabel?: string;
  removeLabel?: string;
  className?: string;
  previewClassName?: string;
  disabled?: boolean;
}

export function FileUpload({
  bucket,
  pathPrefix,
  value,
  onChange,
  title,
  description,
  buttonLabel,
  changeLabel,
  removeLabel,
  className,
  previewClassName,
  disabled,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);

  const handleUpload = React.useCallback(async () => {
    if (disabled || isUploading) return;
    setIsUploading(true);
    try {
      const uploadedUrl = await pickAndUploadImage(bucket, pathPrefix);
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } finally {
      setIsUploading(false);
    }
  }, [bucket, pathPrefix, onChange, disabled, isUploading]);

  const handleRemove = React.useCallback(() => {
    if (disabled) return;
    onChange(null);
  }, [onChange, disabled]);

  const ctaLabel = value ? changeLabel ?? 'Tap to replace' : buttonLabel ?? 'Tap to upload';
  const helperText = description ?? 'PNG, JPG or GIF — up to 10MB';

  return (
    <View className={cn('gap-3', className)}>
      {title ? (
        <Text variant="large" className="font-semibold">
          {title}
        </Text>
      ) : null}

      <Pressable
        disabled={disabled || isUploading}
        onPress={handleUpload}
        className={cn(
          'relative overflow-hidden rounded-3xl border border-dashed border-primary/40 bg-card/80',
          value ? 'p-0' : 'px-6 py-10',
          disabled && 'opacity-50'
        )}>
        {value ? (
          <>
            <Image
              source={{ uri: value }}
              className={cn('h-48 w-full bg-muted', previewClassName)}
            />

            <View className="absolute inset-x-0 bottom-0 flex-row items-center justify-between bg-black/55 px-4 py-3">
              <View className="flex-1 pr-3">
                <Text className="text-base font-semibold text-white">{ctaLabel}</Text>
                <Text className="text-xs text-white/70">{helperText}</Text>
              </View>
              {isUploading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View className="rounded-full bg-white/20 p-2">
                  <Icon as={UploadCloud} size={20} className="text-white" />
                </View>
              )}
            </View>
          </>
        ) : (
          <View className="items-center justify-center gap-3">
            <View className="rounded-full bg-primary/10 p-3">
              {isUploading ? (
                <ActivityIndicator color="#6366F1" />
              ) : (
                <Icon as={UploadCloud} size={28} className="text-primary" />
              )}
            </View>
            <View className="items-center gap-1">
              <Text className="text-base font-semibold text-foreground">{ctaLabel}</Text>
              <Text className="text-center text-sm text-muted-foreground">{helperText}</Text>
            </View>
          </View>
        )}

        {isUploading ? (
          <View className="absolute inset-0 items-center justify-center bg-background/70">
            <ActivityIndicator />
          </View>
        ) : null}
      </Pressable>

      {value && !isUploading ? (
        <View className="flex-row gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            disabled={disabled}
            onPress={handleUpload}>
            <Text>{changeLabel ?? 'Replace'}</Text>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={disabled}
            onPress={handleRemove}>
            <Text className="text-destructive">{removeLabel ?? 'Remove'}</Text>
          </Button>
        </View>
      ) : null}
    </View>
  );
}

export type { FileUploadProps };
