import type { ComponentProps, PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export const palette = {
  blue: '#0A66FF',
  ink: '#0E1A2B',
  slate: '#667085',
  card: '#FFFFFF',
  background: '#F2F5FA',
  success: '#0A9952',
  danger: '#D92D20',
  border: '#D0D5DD',
};

export function AppScreen({ children }: PropsWithChildren) {
  return <View style={styles.screen}>{children}</View>;
}

export function SectionCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

export function Heading({ children }: PropsWithChildren) {
  return <Text style={styles.heading}>{children}</Text>;
}

export function Label({ children }: PropsWithChildren) {
  return <Text style={styles.label}>{children}</Text>;
}

export function FieldInput(props: ComponentProps<typeof TextInput>) {
  return <TextInput {...props} style={[styles.input, props.style]} placeholderTextColor={palette.slate} />;
}

export function ErrorText({ text }: { text?: string }) {
  if (!text) {
    return null;
  }

  return <Text style={styles.error}>{text}</Text>;
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>{label}</Text>}
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" style={styles.secondaryButton} onPress={onPress}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export const ui = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  grow: {
    flex: 1,
  },
  muted: {
    color: palette.slate,
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 14,
    gap: 10,
    marginBottom: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.ink,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: palette.ink,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: palette.ink,
  },
  error: {
    color: palette.danger,
    fontSize: 12,
    marginTop: -4,
  },
  primaryButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: palette.blue,
    fontWeight: '700',
  },
});
