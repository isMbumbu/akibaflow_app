import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeTintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTintColor,
        headerShown: false,
        tabBarButton: HapticTab,
        // Optional: Customize tab bar background for dark theme consistency
        tabBarStyle: {
            backgroundColor: '#1E293B', // Dark bar background
            borderTopColor: '#334155', // Subtle separator color
            height: 60, // Ensure space for icons and text
        },
        tabBarLabelStyle: {
            fontWeight: '600',
            fontSize: 10,
            marginBottom: 4,
        }
      }}>

      {/* 1. Home (index.tsx) */}
            <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="creditcard.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.pie.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tag.fill" color={color} />,
        }}
      />
      
      {/* * The 'add-transaction.tsx' or 'modal.tsx' should be non-tab routes.
        * The 'add.tsx', 'category.tsx', and 'profile.tsx' files within (tabs) 
        * are now excluded because they are not listed here.
      */}
      
    </Tabs>
  );
}