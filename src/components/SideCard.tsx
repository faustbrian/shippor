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
        borderRadius: 10,
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      <View style={{ backgroundColor: '#F8F9FC', borderBottomWidth: 1, borderBottomColor: '#EAECF0', paddingHorizontal: 10, paddingVertical: 8 }}>
        <Text style={{ fontWeight: '800', fontSize: 12, letterSpacing: 0.3, color: '#344054' }}>{title}</Text>
      </View>
      <View style={{ paddingHorizontal: 10, paddingVertical: 10, gap: 6 }}>{children}</View>
    </View>
  );
}
