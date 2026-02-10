import { Text, View } from 'react-native';

export function SideCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: '#D0D5DD',
        borderRadius: 12,
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      <View style={{ backgroundColor: '#F8F9FC', borderBottomWidth: 1, borderBottomColor: '#EAECF0', padding: 10 }}>
        <Text style={{ fontWeight: '800', fontSize: 13 }}>{title}</Text>
      </View>
      <View style={{ padding: 10, gap: 6 }}>{children}</View>
    </View>
  );
}
