import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllObjects } from '../../src/repositories/objectRepository';

type ObjectItem = {
  id: string;
  name: string;
  dateAdded: string;
  nfcTag: string | null;
  typeId: string;
  imageUri: string | null;
};

export default function ObjectListScreen() {
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [search, setSearch] = useState('');

  function loadObjects() {
    const data = getAllObjects() as ObjectItem[];
    setObjects(data);
  }

  useEffect(() => {
    loadObjects();
  }, []);

  const filteredObjects = objects.filter((item) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      item.name.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.typeId.toLowerCase().includes(query) ||
      (item.nfcTag ? item.nfcTag.toLowerCase().includes(query) : false)
    );
  });

  function handleBack() {
    router.back();
  }

  function handleHome() {
    router.replace('/(tabs)/explore');
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
          <Text style={styles.title}>📦 Trove Catalog</Text>
          <Text style={styles.subtitle}>
            Browse scanned objects and open their latest memory.
          </Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{objects.length}</Text>
            <Text style={styles.summaryLabel}>Objects stored</Text>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, type, id, or NFC tag"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.rightPanel}>
          <FlatList
            data={filteredObjects}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyTitle}>No objects found</Text>
                <Text style={styles.emptyText}>
                  Scan a new object from the main scan page to add one to Trove.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                style={styles.card}
                onPress={() => router.push(`/objects/${item.id}`)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.openText}>Open →</Text>
                </View>

                <Text style={styles.meta}>ID: {item.id}</Text>
                <Text style={styles.meta}>Type: {item.typeId}</Text>
                <Text style={styles.meta}>
                  NFC: {item.nfcTag ? item.nfcTag : 'No tag linked'}
                </Text>
                <Text style={styles.meta}>
                  Added: {new Date(item.dateAdded).toLocaleString()}
                </Text>
              </Pressable>
            )}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4efe6',
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
  layout: {
    flex: 1,
    flexDirection: 'row',
    padding: 24,
    gap: 20,
  },
  leftPanel: {
    flex: 0.95,
    justifyContent: 'center',
  },
  rightPanel: {
    flex: 1.25,
    paddingTop: 60,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#2f241f',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#5c4b42',
    marginBottom: 20,
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 42,
    fontWeight: '700',
    color: '#2f241f',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#6a564a',
    marginTop: 4,
  },
  searchInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d8c7b8',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2f241f',
    flex: 1,
  },
  openText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7a685e',
  },
  meta: {
    fontSize: 14,
    color: '#5c4b42',
    marginBottom: 4,
  },
  emptyWrap: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2f241f',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#6a564a',
    textAlign: 'center',
    lineHeight: 22,
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