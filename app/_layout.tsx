import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDatabase } from '../src/db/schema';
import { seedObjectTypes } from '../src/db/seed';

export default function RootLayout() {
  useEffect(() => {
    try {
      initDatabase();
      seedObjectTypes();
      console.log('Database initialized');
    } catch (error) {
      console.error('Database init failed:', error);
    }
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}