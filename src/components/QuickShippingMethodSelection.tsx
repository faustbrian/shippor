import { Pressable, Text, View } from 'react-native';
import type { ShippingMethod } from '../types/models';

function GroupTitle({ title }: { title: string }) {
  return <Text style={{ fontWeight: '800', fontSize: 12, color: '#667085' }}>{title}</Text>;
}

function OptionRow({
  method,
  selected,
  onPress,
}: {
  method: ShippingMethod;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: selected ? '#0A66FF' : '#D0D5DD',
        backgroundColor: selected ? '#EEF4FF' : '#fff',
        borderRadius: 10,
        padding: 10,
      }}
    >
      <Text style={{ fontWeight: '700' }}>{method.carrier} - {method.label}</Text>
      <Text style={{ color: '#667085', fontSize: 12 }}>{method.eta} • ${method.price.toFixed(2)}</Text>
    </Pressable>
  );
}

export function QuickShippingMethodSelection({
  methods,
  selectedId,
  onSelect,
}: {
  methods: ShippingMethod[];
  selectedId?: string;
  onSelect: (method: ShippingMethod) => void;
}) {
  const mostUsed = methods.slice(0, 2);
  const all = methods;

  return (
    <View style={{ gap: 8 }}>
      {!!mostUsed.length && (
        <>
          <GroupTitle title="MOST USED" />
          {mostUsed.map((method) => (
            <OptionRow
              key={`most-${method.id}`}
              method={method}
              selected={selectedId === method.id}
              onPress={() => onSelect(method)}
            />
          ))}
        </>
      )}
      <GroupTitle title="ALL" />
      {all.map((method) => (
        <OptionRow
          key={`all-${method.id}`}
          method={method}
          selected={selectedId === method.id}
          onPress={() => onSelect(method)}
        />
      ))}
    </View>
  );
}
