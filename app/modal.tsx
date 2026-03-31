import { SafeAreaView, StyleSheet, Text } from 'react-native';

export default function ModalScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📄 Modal</Text>
      <Text>This modal screen is now cleaned up.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
});
