import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllObjects } from '../../src/repositories/objectRepository';

type ObjectItem = {
  id: string;
  name: string;
  typeId: string;
};

export default function ObjectListScreen() {
  const [objects, setObjects] = useState<ObjectItem[]>([]);

  function loadObjects() {
    const data = getAllObjects() as ObjectItem[];
    setObjects(data);
  }

  useEffect(() => {
    loadObjects();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>📦 Your Objects</Text>

        <FlatList
          data={objects}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.empty}>No objects yet</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/objects/${item.id}`)}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>Type: {item.typeId}</Text>
            </Pressable>
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
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  meta: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});