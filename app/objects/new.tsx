import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

import { PhysicalObject } from '../../src/models/PhysicalObject';
import { Recording } from '../../src/models/Recording';
import { getFirstUser } from '../../src/repositories/userRepository';

type StoredUser = {
  username: string;
  passwordHash: string;
};

export default function NewObjectScreen() {
  const { scannedTag } = useLocalSearchParams<{ scannedTag?: string }>();

  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [status, setStatus] = useState('Name the object, then add a photo or voice memory.');
  const [isSaving, setIsSaving] = useState(false);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    if (recorderState.isRecording) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.12,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulse.stopAnimation();
      pulse.setValue(1);
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [recorderState.isRecording, pulse]);

  useEffect(() => {
    async function prepareAudio() {
      try {
        const permission = await AudioModule.requestRecordingPermissionsAsync();

        if (!permission.granted) {
          setStatus('Microphone permission was denied.');
          return;
        }

        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
      } catch (error) {
        setStatus(
          error instanceof Error
            ? error.message
            : 'Could not prepare audio recording.'
        );
      }
    }

    prepareAudio();
  }, []);

  async function handleTakePhoto() {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permission needed', 'Camera permission is required to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const pickedAsset = result.assets?.[0];

      if (!pickedAsset?.uri) {
        Alert.alert('No image', 'No photo was returned from the camera.');
        return;
      }

      setImageUri(pickedAsset.uri);
      setStatus('Photo captured.');
    } catch (error) {
      Alert.alert(
        'Camera error',
        error instanceof Error ? error.message : 'Could not open the camera.'
      );
    }
  }

  async function handleRecordPress() {
    try {
      if (recorderState.isRecording) {
        await recorder.stop();
        setStatus('Voice recording saved locally.');
        return;
      }

      await recorder.prepareToRecordAsync();
      await recorder.record();
      setStatus('Recording...');
    } catch (error) {
      Alert.alert(
        'Recording error',
        error instanceof Error ? error.message : 'Could not record audio.'
      );
    }
  }

  async function handleSave() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Missing name', 'Please enter a name for the scanned object.');
      return;
    }

    if (!scannedTag) {
      Alert.alert('Missing NFC tag', 'This page expects a scanned NFC tag.');
      return;
    }

    try {
      setIsSaving(true);

      if (recorderState.isRecording) {
        await recorder.stop();
      }

      const objectId = `obj_${Date.now()}`;
      const currentUser = getFirstUser() as StoredUser | null;

      const newObject = new PhysicalObject(
        objectId,
        trimmedName,
        new Date().toISOString(),
        scannedTag,
        'artifact',
        imageUri
      );

      newObject.register();

      const audioUri = recorder.uri ?? null;

      if (audioUri || imageUri) {
        const newRecording = new Recording(
          `rec_${Date.now()}`,
          objectId,
          audioUri,
          imageUri,
          scannedTag,
          new Date().toISOString(),
          currentUser?.username ?? 'anonymous'
        );

        newRecording.save();
      }

      Alert.alert('Saved', 'The new object was added to Trove.');
      router.replace(`/objects/${objectId}`);
    } catch (error) {
      Alert.alert(
        'Save error',
        error instanceof Error ? error.message : 'Could not save the object.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    router.back();
  }

  function handleHome() {
    router.replace('/(tabs)/explore');
  }

  const recordingSeconds = Math.floor((recorderState.durationMillis ?? 0) / 1000);

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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.layout}>
          <View style={styles.leftPanel}>
            <Text style={styles.title}>Trove</Text>
            <Text style={styles.subtitle}>New scanned object</Text>

            <View style={styles.infoCard}>
              <Text style={styles.label}>Scanned NFC Tag</Text>
              <Text style={styles.tagValue}>
                {scannedTag ? scannedTag : 'No tag received'}
              </Text>

              <Text style={styles.label}>Object Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Give this object a name"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.status}>{status}</Text>
            </View>

            <Pressable
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Object'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.rightPanel}>
            <View style={styles.mediaCard}>
              <Text style={styles.sectionTitle}>🎙️ Voice memory</Text>

              <Animated.View
                style={[
                  styles.rippleWrap,
                  { transform: [{ scale: pulse }] },
                ]}
              >
                <Pressable style={styles.recordButton} onPress={handleRecordPress}>
                  <Text style={styles.recordEmoji}>
                    {recorderState.isRecording ? '⏹️' : '🎙️'}
                  </Text>
                </Pressable>
              </Animated.View>

              <Text style={styles.recordText}>
                {recorderState.isRecording
                  ? `Recording... ${recordingSeconds}s`
                  : recorder.uri
                  ? 'Tap to record again'
                  : 'Tap the circle to start recording'}
              </Text>
            </View>

            <View style={styles.mediaCard}>
              <Text style={styles.sectionTitle}>📸 Photo</Text>

              <Pressable style={styles.cameraButton} onPress={handleTakePhoto}>
                <Text style={styles.cameraEmoji}>📸</Text>
              </Pressable>

              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.emptyPreview}>
                  <Text style={styles.emptyPreviewText}>No photo yet</Text>
                </View>
              )}
            </View>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
  },
  leftPanel: {
    flex: 1.05,
    justifyContent: 'center',
  },
  rightPanel: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
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
    fontSize: 42,
    fontWeight: '700',
    color: '#2f241f',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    color: '#5c4b42',
    marginBottom: 18,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 22,
    padding: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4b3b33',
    marginBottom: 8,
    marginTop: 10,
  },
  tagValue: {
    fontSize: 15,
    color: '#6a564a',
    backgroundColor: '#fffaf6',
    borderRadius: 12,
    padding: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d8c7b8',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  status: {
    marginTop: 16,
    color: '#6a564a',
    fontSize: 15,
    lineHeight: 21,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#2f241f',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  mediaCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 260,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2f241f',
    marginBottom: 18,
  },
  rippleWrap: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(216,199,184,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  recordButton: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#fffaf6',
    borderWidth: 3,
    borderColor: '#d8c7b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordEmoji: {
    fontSize: 46,
  },
  recordText: {
    fontSize: 15,
    color: '#6a564a',
    textAlign: 'center',
  },
  cameraButton: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#fffaf6',
    borderWidth: 2,
    borderColor: '#d8c7b8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cameraEmoji: {
    fontSize: 40,
  },
  previewImage: {
    width: 220,
    height: 140,
    borderRadius: 14,
    resizeMode: 'cover',
  },
  emptyPreview: {
    width: 220,
    height: 140,
    borderRadius: 14,
    backgroundColor: '#fffaf6',
    borderWidth: 1,
    borderColor: '#e3d7cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPreviewText: {
    color: '#8a7669',
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