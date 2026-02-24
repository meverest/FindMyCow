// FindMyCow — App Navigator
// Sets up bottom-tab navigation with a nested stack for the Herd Book.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import MatchResultsScreen from '../screens/MatchResultsScreen';
import HerdBookScreen from '../screens/HerdBookScreen';
import CowProfileScreen from '../screens/CowProfileScreen';
import CowDexScreen from '../screens/CowDexScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { COLORS } from '../theme';

// ─── Type Definitions ─────────────────────────────────────────────────────────

export type RootStackParamList = {
  MainTabs: undefined;
  MatchResults: { photoUri: string };
  CowProfile: { cowId: string };
};

export type TabParamList = {
  Home: undefined;
  HerdBook: undefined;
  CowDex: undefined;
  Settings: undefined;
};

// ─── Navigators ───────────────────────────────────────────────────────────────

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ label }: { label: string }) {
  const icons: Record<string, string> = {
    Home: '📷',
    HerdBook: '📖',
    CowDex: '🐮',
    Settings: '⚙️',
  };
  return <Text style={{ fontSize: 20 }}>{icons[label] ?? '?'}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => <TabIcon label={route.name} />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Camera' }} />
      <Tab.Screen name="HerdBook" component={HerdBookScreen} options={{ title: 'Herd Book' }} />
      <Tab.Screen name="CowDex" component={CowDexScreen} options={{ title: 'CowDex' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="MatchResults"
          component={MatchResultsScreen}
          options={{ title: 'Identification Results', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="CowProfile"
          component={CowProfileScreen}
          options={{ title: 'Cow Profile', headerBackTitle: 'Back' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
