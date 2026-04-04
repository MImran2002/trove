import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { findObjectById } from '../../src/repositories/objectRepository';
import {
  getLatestRecordingByObject,
  getRecordingsByObject,
} from '../../src/repositories/recordingRepository';

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
  const [latestRecording, setLatestRecording] = useState<RecordingItem | null>(null);
  const [showLatestModal, setShowLatestModal] = useState(true);
  const [audioStatus, setAudioStatus] = useState('No audio selected');

  const player = useAudioPlayer(null);

  function loadObjectData() {
    if (!id) return;

    const foundObject = findObjectById(id) as PhysicalObjectItem | null;
    const foundRecordings = getRecordingsByObject(id) as RecordingItem[];
    const newestRecording = getLatestRecordingByObject(id) as RecordingItem | null;

    setObject(foundObject);
    setRecordings(foundRecordings);
    setLatestRecording(newestRecording);
  }

  useEffect(() => {
    loadObjectData();
  }, [id]);

  useEffect(() => {
    async function prepareAudio() {
      try {
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });
      } catch {
        // ignore playback mode errors for now
      }
    }

    prepareAudio();
  }, []);

  async function handlePlayAudio(uri: string | null) {
    if (!uri) {
      setAudioStatus('No audio file on this recording');
      return;
    }

    try {
      player.replace(uri);
      player.play();
      setAudioStatus('Playing audio...');
    } catch (error) {
      setAudioStatus(
        error instanceof Error ? error.message : 'Could not play audio'
      );
    }
  }

  function handleBack() {
    router.back();
  }

  function handleHome() {
    router.replace('/(tabs)/explore');
  }

  const formattedDate = useMemo(() => {
    if (!object?.dateAdded) return 'Unknown';
    return new Date(object.dateAdded).toLocaleString();
  }, [object]);

  if (!object) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.title}>Object not found</Text>
          <Pressable style={styles.primaryButton} onPress={handleHome}>
            <Text style={styles.primaryButtonText}>Go Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.bg1}>✨</Text>
      <Text style={styles.bg2}>🧸</Text>
      <Text style={styles.bg3}>🌙</Text>
      <Text style={styles.bg4}>🍀</Text>

      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.topIconButton}>
          <Text style={styles.topIcon}>←</Text>
        </Pressable>

        <Pressable onPress={handleHome} style={styles.topIconButton}>
          <Text style={styles.topIcon}>🏠</Text>
        </Pressable>
      </View>

      <View style={styles.layout}>
        <View style={styles.leftPanel}>
          <Text style={styles.title}>📦 {object.name}</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Object ID</Text>
            <Text style={styles.value}>{object.id}</Text>

            <Text style={styles.label}>Type</Text>
            <Text style={styles.value}>{object.typeId}</Text>

            <Text style={styles.label}>Date Added</Text>
            <Text style={styles.value}>{formattedDate}</Text>

            <Text style={styles.label}>NFC Tag</Text>
            <Text style={styles.value}>
              {object.nfcTag ? object.nfcTag : 'No NFC tag linked'}
            </Text>

            <Text style={styles.label}>Image</Text>
            {object.imageUri ? (
              <Image source={{ uri: object.imageUri }} style={styles.objectImage} />
            ) : (
              <View style={styles.emptyImage}>
                <Text style={styles.emptyImageText}>No saved object image</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.rightPanel}>
          <Text style={styles.sectionTitle}>🎙️ Recordings</Text>

          <Text style={styles.audioStatus}>{audioStatus}</Text>

          <FlatList
            data={recordings}
            keyExtractor={(item) => item.recordingId}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.empty}>No recordings for this object yet</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.recordingCard}>
                <Text style={styles.recordingTitle}>{item.recordingId}</Text>
                <Text style={styles.recordingMeta}>Recorded by: {item.recordedBy}</Text>
                <Text style={styles.recordingMeta}>
                  Recorded at: {new Date(item.recordedAt).toLocaleString()}
                </Text>
                <Text style={styles.recordingMeta}>
                  NFC Snapshot: {item.nfcSnapshot ? item.nfcSnapshot : 'None'}
                </Text>

                <View style={styles.recordingActions}>
                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => handlePlayAudio(item.audioUri)}
                  >
                    <Text style={styles.secondaryButtonText}>▶ Play Audio</Text>
                  </Pressable>

                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => {
                      setLatestRecording(item);
                      setShowLatestModal(true);
                    }}
                  >
                    <Text style={styles.secondaryButtonText}>Open</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        </View>
      </View>

      <Modal
        visible={!!latestRecording && showLatestModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLatestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Latest Memory</Text>

            {latestRecording?.imageUri ? (
              <Image
                source={{ uri: latestRecording.imageUri }}
                style={styles.modalImage}
              />
            ) : (
              <View style={styles.modalPlaceholder}>
                <Text style={styles.modalPlaceholderText}>🎞️ No image preview</Text>
              </View>
            )}

            <Text style={styles.modalMeta}>
              Recording ID: {latestRecording?.recordingId ?? 'Unknown'}
            </Text>
            <Text style={styles.modalMeta}>
              Recorded by: {latestRecording?.recordedBy ?? 'Unknown'}
            </Text>
            <Text style={styles.modalMeta}>
              Recorded at:{' '}
              {latestRecording?.recordedAt
                ? new Date(latestRecording.recordedAt).toLocaleString()
                : 'Unknown'}
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => handlePlayAudio(latestRecording?.audioUri ?? null)}
              >
                <Text style={styles.secondaryButtonText}>▶ Play Audio</Text>
              </Pressable>

              <Pressable
                style={styles.primaryButton}
                onPress={() => setShowLatestModal(false)}
              >
                <Text style={styles.primaryButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4efe6',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
    padding: 24,
    gap: 20,
  },
  leftPanel: {
    flex: 1,
  },
  rightPanel: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topIconButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2f241f',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: 18,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginTop: 10,
    fontWeight: '700',
  },
  value: {
    fontSize: 16,
    color: '#111',
    marginTop: 4,
  },
  objectImage: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    marginTop: 8,
    resizeMode: 'cover',
  },
  emptyImage: {
    marginTop: 8,
    height: 200,
    borderRadius: 14,
    backgroundColor: '#fffaf6',
    borderWidth: 1,
    borderColor: '#e3d7cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImageText: {
    color: '#8a7669',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2f241f',
    marginBottom: 12,
  },
  audioStatus: {
    marginBottom: 12,
    color: '#6a564a',
  },
  emptyWrap: {
    paddingTop: 30,
  },
  empty: {
    color: '#777',
    textAlign: 'center',
  },
  recordingCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  recordingTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  recordingMeta: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  recordingActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  secondaryButton: {
    backgroundColor: '#e8ddd2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: '#2f241f',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#2f241f',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(47,36,31,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '80%',
    maxWidth: 720,
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 22,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2f241f',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalImage: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  modalPlaceholder: {
    height: 280,
    borderRadius: 16,
    backgroundColor: '#fffaf6',
    borderWidth: 1,
    borderColor: '#e3d7cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalPlaceholderText: {
    color: '#8a7669',
    fontSize: 20,
  },
  modalMeta: {
    fontSize: 15,
    color: '#5c4b42',
    marginBottom: 6,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  bg1: {
    position: 'absolute',
    top: 70,
    left: 90,
    fontSize: 28,
  },
  bg2: {
    position: 'absolute',
    top: 120,
    right: 130,
    fontSize: 28,
  },
  bg3: {
    position: 'absolute',
    bottom: 80,
    left: 60,
    fontSize: 28,
  },
  bg4: {
    position: 'absolute',
    bottom: 70,
    right: 80,
    fontSize: 28,
  },
});