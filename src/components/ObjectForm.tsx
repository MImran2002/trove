import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { PhysicalObject } from '../models/PhysicalObject';

type Props = {
  scannedTag?: string | null;
  onSaved?: () => void;
};

export default function ObjectForm({ scannedTag, onSaved }: Props) {
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState('artifact');
  const [imageUri, setImageUri] = useState('');

  function handleSave() {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter an object name.');
      return;
    }

    try {
      const newObject = new PhysicalObject(
        `obj_${Date.now()}`,
        name.trim(),
        new Date().toISOString(),
        scannedTag ?? null,
        typeId.trim(),
        imageUri.trim() || null
      );

      newObject.register();

      Alert.alert('Saved', 'Physical object registered successfully');

      setName('');
      setTypeId('artifact');
      setImageUri('');

      onSaved?.();
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Could not save object'
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Object Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter object name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Type ID</Text>
      <TextInput
        style={styles.input}
        placeholder="artifact / tool / memory"
        value={typeId}
        onChangeText={setTypeId}
      />

      <Text style={styles.label}>Image URI (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Leave blank for now"
        value={imageUri}
        onChangeText={setImageUri}
      />

      <Text style={styles.label}>Scanned NFC Tag</Text>
      <Text style={styles.tagValue}>
        {scannedTag ? scannedTag : 'No NFC tag scanned'}
      </Text>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Object</Text>
      </Pressable>
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
  tagValue: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});