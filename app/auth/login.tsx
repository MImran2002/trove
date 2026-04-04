import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { getFirstUser } from '../../src/repositories/userRepository';
import {
  deserializeEmojiSequence,
  EMOJI_OPTIONS,
  sequencesMatch,
} from '../../src/utils/emojiPassword';
import { SafeAreaView } from 'react-native-safe-area-context';

type StoredUser = {
  username: string;
  passwordHash: string;
};

export default function LoginScreen() {
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);

  const preview = useMemo(() => {
    if (selectedSequence.length === 0) {
      return 'No emoji selected yet';
    }

    return selectedSequence.join(' ');
  }, [selectedSequence]);

  function handleEmojiPress(emoji: string) {
    setSelectedSequence((current) => [...current, emoji]);
  }

  function handleBackspace() {
    setSelectedSequence((current) => current.slice(0, -1));
  }

  function handleClear() {
    setSelectedSequence([]);
  }

  function handleLogin() {
    try {
      const user = getFirstUser() as StoredUser | null;

      if (!user) {
        Alert.alert('No user found', 'Please sign up first.');
        router.replace('/auth/signup');
        return;
      }

      const storedSequence = deserializeEmojiSequence(user.passwordHash);
      const isValid = sequencesMatch(selectedSequence, storedSequence);

      if (!isValid) {
        Alert.alert('Incorrect sequence', 'That emoji sequence does not match.');
        return;
      }

      Alert.alert('Welcome back', `Logged in as ${user.username}`);
      router.replace('/(tabs)/explore');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Could not log in'
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <Text style={styles.bg1}>✨</Text>
        <Text style={styles.bg2}>🧸</Text>
        <Text style={styles.bg3}>🌙</Text>
        <Text style={styles.bg4}>🍀</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Trove Login</Text>
        <Text style={styles.subtitle}>Tap your saved emoji password in the correct order.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Selected Sequence</Text>
          <View style={styles.sequenceBox}>
            <Text style={styles.sequenceText}>{preview}</Text>
          </View>

          <Text style={styles.hint}>Tap emojis in the same sequence you created during signup.</Text>

          <View style={styles.emojiGrid}>
            {EMOJI_OPTIONS.map((emoji) => (
              <Pressable
                key={emoji}
                style={styles.emojiButton}
                onPress={() => handleEmojiPress(emoji)}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryButton} onPress={handleBackspace}>
              <Text style={styles.secondaryButtonText}>⌫ Remove Last</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleClear}>
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </Pressable>
          </View>

          <Pressable style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Enter Trove</Text>
          </Pressable>

          <Pressable style={styles.textButton} onPress={() => router.back()}>
            <Text style={styles.textButtonText}>← Back</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4efe6',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  bg1: {
    position: 'absolute',
    top: 40,
    left: 40,
    fontSize: 28,
  },
  bg2: {
    position: 'absolute',
    top: 80,
    right: 80,
    fontSize: 28,
  },
  bg3: {
    position: 'absolute',
    bottom: 70,
    left: 70,
    fontSize: 28,
  },
  bg4: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    fontSize: 28,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2f241f',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#5c4b42',
    marginBottom: 22,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
    color: '#2f241f',
  },
  sequenceBox: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#d8c7b8',
    backgroundColor: '#fffaf6',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
  },
  sequenceText: {
    fontSize: 20,
    color: '#2f241f',
  },
  hint: {
    marginTop: 8,
    marginBottom: 14,
    color: '#6c5a50',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  emojiButton: {
    width: 62,
    height: 62,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1d4c8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#e8ddd2',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2f241f',
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 14,
    backgroundColor: '#2f241f',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  textButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  textButtonText: {
    color: '#5c4b42',
    fontSize: 15,
    fontWeight: '600',
  },
});