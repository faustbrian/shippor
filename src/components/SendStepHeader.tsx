import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { palette } from './ui';

const steps = [
  'Basic',
  'Address',
  'Details',
  'Methods',
  'Cart',
  'Payment',
  'Done',
];

export function SendStepHeader({ currentStep }: { currentStep: number }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Shipping Tool</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {steps.map((step, index) => {
          const number = index + 1;
          const active = number === currentStep;
          const done = number < currentStep;
          return (
            <View key={step} style={[styles.pill, active && styles.activePill, done && styles.donePill]}>
              <Text style={[styles.pillText, (active || done) && styles.activePillText]}>{number}. {step}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.ink,
  },
  row: {
    gap: 8,
    paddingRight: 8,
  },
  pill: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  activePill: {
    borderColor: palette.blue,
    backgroundColor: '#EAF2FF',
  },
  donePill: {
    borderColor: '#0A9952',
    backgroundColor: '#E8F8EF',
  },
  pillText: {
    color: '#475467',
    fontWeight: '600',
    fontSize: 12,
  },
  activePillText: {
    color: '#0E1A2B',
  },
});
