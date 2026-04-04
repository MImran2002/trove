import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabEmoji({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: focused ? 24 : 22,
        opacity: focused ? 1 : 0.7,
      }}
    >
      {emoji}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: 16,
          height: 72,
          borderRadius: 24,
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderTopWidth: 0,
          elevation: 8,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 8,
        },
        tabBarActiveTintColor: '#2f241f',
        tabBarInactiveTintColor: '#8a7669',
        sceneStyle: {
          backgroundColor: '#f4efe6',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabEmoji emoji="🔑" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused }) => (
            <TabEmoji emoji="✚" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}