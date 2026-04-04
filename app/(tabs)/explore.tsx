import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NFCScanner } from '../../src/services/nfcService';
import { findObjectByNfcTag } from '../../src/repositories/objectRepository';
import { hasRegisteredUser } from '../../src/repositories/userRepository';

type ExistingObject = {
  id: string;
  name: string;
  dateAdded: string;
  nfcTag: string | null;
  typeId: string;
  imageUri: string | null;
};

export default function ScanScreen() {
  const [status, setStatus] = useState('Tap the ✚ to scan an object');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const userExists = hasRegisteredUser();

    if (!userExists) {
      router.replace('/(tabs)');
    }
  }, []);

  async function handleScan() {
    try {
      setIsScanning(true);
      setStatus('Waiting for NFC tag...');

      const scanner = new NFCScanner();
      const tag = await scanner.scan();

      setStatus(`Tag detected: ${tag}`);

      const existingObject = findObjectByNfcTag(tag) as ExistingObject | null;

      if (existingObject) {
        setStatus(`Opening: ${existingObject.name}`);
        router.push(`/objects/${existingObject.id}`);
        return;
      }

      setStatus('New object detected');

      router.push({
        pathname: '/objects/new',
        params: { scannedTag: tag },
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Scan failed');
    } finally {
      setIsScanning(false);
    }
  }

  function handleLogout() {
    router.replace('/(tabs)');
  }

  function goToCatalog() {
    router.push('/objects');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.bg1}>✨</Text>
      <Text style={styles.bg2}>🧸</Text>
      <Text style={styles.bg3}>🌙</Text>
      <Text style={styles.bg4}>🍎</Text>
      <Text style={styles.bg5}>🎈</Text>
      <Text style={styles.bg6}>🍀</Text>

      <View style={styles.topBar}>
        <Pressable onPress={goToCatalog}>
          <Text style={styles.topEmoji}>📦</Text>
        </Pressable>

        <Pressable onPress={handleLogout}>
          <Text style={styles.topEmoji}>🔑</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Trove</Text>

        <Pressable
          style={[
            styles.scanButton,
            isScanning && styles.scanButtonDisabled,
          ]}
          onPress={handleScan}
          disabled={isScanning}
        >
          <Text style={styles.scanEmoji}>
            {isScanning ? '⏳' : '✚'}
          </Text>
        </Pressable>

        <Text style={styles.status}>{status}</Text>

        <Text style={styles.hint}>Tap the ✚ to scan a physical object</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4efe6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg1: { position: 'absolute', top: 40, left: 40, fontSize: 28 },
  bg2: { position: 'absolute', top: 80, right: 80, fontSize: 28 },
  bg3: { position: 'absolute', bottom: 60, left: 60, fontSize: 28 },
  bg4: { position: 'absolute', bottom: 40, right: 40, fontSize: 28 },
  bg5: { position: 'absolute', top: 220, left: 120, fontSize: 28 },
  bg6: { position: 'absolute', bottom: 220, right: 120, fontSize: 28 },
  topBar: {
    position: 'absolute',
    top: 20,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topEmoji: {
    fontSize: 30,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    marginBottom: 30,
    color: '#2f241f',
  },
  scanButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fffaf6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#d8c7b8',
    marginBottom: 24,
  },
  scanButtonDisabled: {
    opacity: 0.7,
  },
  scanEmoji: {
    fontSize: 80,
  },
  status: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4b3b33',
    marginBottom: 10,
    maxWidth: 400,
  },
  hint: {
    fontSize: 14,
    color: '#7a685e',
  },
});