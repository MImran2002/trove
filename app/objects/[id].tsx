import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { findObjectById } from '../../src/repositories/objectRepository';
import { getRecordingsByObject } from '../../src/repositories/recordingRepository';

type PhysicalObjectItem = {
  id: string;
  name: string;
  dateAdded: string;
  nfcTag: string | null;
  typeId: string;
  imageUri: string | null;
};

type RecordingItem = {
  recordingId: string;
  objectId: string;
  audioUri: string | null;
  imageUri: string | null;
  nfcSnapshot: string | null;
  recordedAt: string;
  recordedBy: string;
};

export default function ObjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [object, setObject] = useState<PhysicalObjectItem | null>(null);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);

  useEffect(() => {
    if (!id) return;

    const foundObject = findObjectById(id) as PhysicalObjectItem | null;
    const foundRecordings = getRecordingsByObject(id) as RecordingItem[];

    setObject(foundObject);
    setRecordings(foundRecordings);
  }, [id]);

  if (!object) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.title}>Object not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>📦 {object.name}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Object ID</Text>
          <Text style={styles.value}>{object.id}</Text>

          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>{object.typeId}</Text>

          <Text style={styles.label}>Date Added</Text>
          <Text style={styles.value}>{object.dateAdded}</Text>

          <Text style={styles.label}>NFC Tag</Text>
          <Text style={styles.value}>
            {object.nfcTag ? object.nfcTag : 'No NFC tag linked yet'}
          </Text>

          <Text style={styles.label}>Image URI</Text>
          <Text style={styles.value}>
            {object.imageUri ? object.imageUri : 'No image yet'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>🎙️ Recordings</Text>

        <FlatList
          data={recordings}
          keyExtractor={(item) => item.recordingId}
          ListEmptyComponent={
            <Text style={styles.empty}>No recordings for this object yet</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.recordingCard}>
              <Text style={styles.recordingTitle}>{item.recordingId}</Text>
              <Text style={styles.recordingMeta}>Recorded by: {item.recordedBy}</Text>
              <Text style={styles.recordingMeta}>Recorded at: {item.recordedAt}</Text>
              <Text style={styles.recordingMeta}>
                NFC Snapshot: {item.nfcSnapshot ? item.nfcSnapshot : 'None'}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  inner: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#111',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  empty: {
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  recordingCard: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  recordingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  recordingMeta: {
    fontSize: 14,
    color: '#555',
  },
});