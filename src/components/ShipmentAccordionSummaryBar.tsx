import { Text, View } from 'react-native';

export function ShipmentAccordionSummaryBar({
  title,
  price,
  status,
}: {
  title: string;
  price: number;
  status: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EAECF0',
        paddingBottom: 8,
      }}
    >
      <View>
        <Text style={{ fontWeight: '700' }}>{title}</Text>
        <Text style={{ color: '#667085', fontSize: 12 }}>{status}</Text>
      </View>
      <Text style={{ fontWeight: '800' }}>${price.toFixed(2)}</Text>
    </View>
  );
}
