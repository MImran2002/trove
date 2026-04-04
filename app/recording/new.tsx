import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecordingForm from '../../src/components/RecordingForm';

export default function NewRecordingScreen() {
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
          <Text style={styles.title}>🎙️ Trove Recording</Text>
          <Text style={styles.subtitle}>
            Manual testing screen for adding a recording to an existing object.
          </Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How to use this page</Text>
            <Text style={styles.infoText}>
              Enter the object ID, the username, and any optional media values to
              save a test recording directly into the Trove database.
            </Text>
            <Text style={styles.infoText}>
              This page is mainly for development and backup testing.
            </Text>
          </View>
        </View>

        <View style={styles.rightPanel}>
          <View style={styles.formCard}>
            <RecordingForm onSaved={() => router.back()} />
          </View>
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
    flex: 1.15,
    justifyContent: 'center',
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
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2f241f',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#6a564a',
    lineHeight: 22,
    marginBottom: 8,
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: 20,
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