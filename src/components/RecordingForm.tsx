import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Recording } from '../models/Recording';

type Props = {
  onSaved?: () => void;
};

export default function RecordingForm({ onSaved }: Props) {
  const [objectId, setObjectId] = useState('');
  const [recordedBy, setRecordedBy] = useState('');
  const [nfcSnapshot, setNfcSnapshot] = useState('');
  const [audioUri, setAudioUri] = useState('');
  const [imageUri, setImageUri] = useState('');

  function handleSave() {
    try {
      const newRecording = new Recording(
        `rec_${Date.now()}`,
        objectId.trim(),
        audioUri.trim() || null,
        imageUri.trim() || null,
        nfcSnapshot.trim() || null,
        new Date().toISOString(),
        recordedBy.trim()
      );

      newRecording.save();

      Alert.alert('Saved', 'Recording saved successfully');

      setObjectId('');
      setRecordedBy('');
      setNfcSnapshot('');
      setAudioUri('');
      setImageUri('');

      onSaved?.();
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Could not save recording'
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Object ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter linked object ID"
        value={objectId}
        onChangeText={setObjectId}
      />

      <Text style={styles.label}>Recorded By</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={recordedBy}
        onChangeText={setRecordedBy}
      />

      <Text style={styles.label}>NFC Snapshot (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Mock NFC tag for now"
        value={nfcSnapshot}
        onChangeText={setNfcSnapshot}
      />

      <Text style={styles.label}>Audio URI (optional for now)</Text>
      <TextInput
        style={styles.input}
        placeholder="Will be wired to expo-audio later"
        value={audioUri}
        onChangeText={setAudioUri}
      />

      <Text style={styles.label}>Image URI (optional for now)</Text>
      <TextInput
        style={styles.input}
        placeholder="Will be wired to expo-camera later"
        value={imageUri}
        onChangeText={setImageUri}
      />

      <Button title="Save Recording" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
});