import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { PhysicalObject } from '../models/PhysicalObject';

type Props = {
  onSaved?: () => void;
};

export default function ObjectForm({ onSaved }: Props) {
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState('artifact');
  const [imageUri, setImageUri] = useState('');

  function handleSave() {
    try {
      const newObject = new PhysicalObject(
        `obj_${Date.now()}`,
        name.trim(),
        new Date().toISOString(),
        null,
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

      <Button title="Save Object" onPress={handleSave} />
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