import { Button, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>🚀 Trove App Ready</Text>

        <View style={styles.buttonGroup}>
          <Button
            title="Create New Object"
            onPress={() => router.push('/objects/new')}
          />

          <Button
            title="View Objects"
            onPress={() => router.push('/objects')}
          />

          <Button
            title="Create Recording"
            onPress={() => router.push('/recordings/new')}
          />
        </View>
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
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 12,
  },
});