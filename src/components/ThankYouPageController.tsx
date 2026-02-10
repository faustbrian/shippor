import { Text, View } from 'react-native';

export function ThankYouPageController({
  isLoadingDocuments,
  hasDocumentsError,
  documentsCount,
  children,
}: {
  isLoadingDocuments: boolean;
  hasDocumentsError: boolean;
  documentsCount: number;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 10 }}>
      <View style={{ borderWidth: 1, borderColor: '#EAECF0', borderRadius: 10, padding: 10, backgroundColor: '#fff' }}>
        <Text style={{ fontWeight: '700' }}>Thank-you controller</Text>
        <Text style={{ color: '#667085' }}>{isLoadingDocuments ? 'Loading documents metadata' : 'Documents metadata loaded'}</Text>
        <Text style={{ color: '#667085' }}>Documents available: {documentsCount}</Text>
        {hasDocumentsError ? <Text style={{ color: '#D92D20' }}>Failed to load documents metadata</Text> : null}
      </View>
      {children}
    </View>
  );
}
