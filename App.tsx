// FindMyCow — Application Root
// Initialises offline storage with mock data on first launch,
// then mounts the navigation tree.

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { getCows, saveCow, saveFarm, saveField } from './src/data/storage';
import { MOCK_COWS, MOCK_FARMS, MOCK_FIELDS } from './src/data/mockData';
import { COLORS } from './src/theme';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function seed() {
      // Only seed if the Herd Book is completely empty
      const existing = await getCows();
      if (existing.length === 0) {
        for (const farm of MOCK_FARMS) {
          await saveFarm(farm);
        }
        for (const field of MOCK_FIELDS) {
          await saveField(field);
        }
        for (const cow of MOCK_COWS) {
          await saveCow(cow);
        }
      }
      setReady(true);
    }
    seed();
  }, []);

  if (!ready) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
