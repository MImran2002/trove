import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hasRegisteredUser } from '../../src/repositories/userRepository';

export default function HomeScreen() {
  function handleKeyPress() {
    const userExists = hasRegisteredUser();

    if (userExists) {
      router.push('/auth/login');
      return;
    }

    router.push('/auth/signup');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.bg1}>🧸</Text>
      <Text style={styles.bg2}>🌙</Text>
      <Text style={styles.bg3}>✨</Text>
      <Text style={styles.bg4}>🍎</Text>
      <Text style={styles.bg5}>🎈</Text>
      <Text style={styles.bg6}>🍀</Text>

      <View style={styles.centerContent}>
        <Text style={styles.title}>Trove</Text>

        <Pressable style={styles.keyButton} onPress={handleKeyPress}>
          <Text style={styles.keyEmoji}>🔑</Text>
        </Pressable>

        <Text style={styles.caption}>
          Tap the key to sign up or log in
        </Text>
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
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    color: '#2f241f',
    marginBottom: 26,
  },
  keyButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#fffaf6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d8c7b8',
    marginBottom: 18,
  },
  keyEmoji: {
    fontSize: 52,
  },
  caption: {
    fontSize: 17,
    color: '#5c4b42',
    textAlign: 'center',
  },
  bg1: {
    position: 'absolute',
    top: 40,
    left: 35,
    fontSize: 28,
  },
  bg2: {
    position: 'absolute',
    top: 100,
    right: 55,
    fontSize: 28,
  },
  bg3: {
    position: 'absolute',
    bottom: 50,
    left: 55,
    fontSize: 28,
  },
  bg4: {
    position: 'absolute',
    bottom: 90,
    right: 80,
    fontSize: 28,
  },
  bg5: {
    position: 'absolute',
    top: 220,
    left: 90,
    fontSize: 28,
  },
  bg6: {
    position: 'absolute',
    bottom: 220,
    right: 120,
    fontSize: 28,
  },
});