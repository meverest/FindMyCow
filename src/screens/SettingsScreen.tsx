// FindMyCow — Settings Screen

import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { clearAll } from '../data/storage';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete your Herd Book and all sightings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            Alert.alert('Done', 'All local data has been cleared.');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Settings</Text>

        {/* Account section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Row label="Email" value="demo@findmycow.app" />
          <Row label="Role" value="Owner" />
          <Row label="Farm" value="Greenhill Farm" />
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <ToggleRow
            label="Health check reminders"
            description="Alert when a cow hasn't been sighted in 7 days"
            value={notifications}
            onValueChange={setNotifications}
          />
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          <ToggleRow
            label="Force offline mode"
            description="Use only locally cached data (for testing)"
            value={offlineMode}
            onValueChange={setOfflineMode}
          />
          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={handleClearData}
            accessibilityLabel="Clear all local data"
          >
            <Text style={styles.dangerText}>🗑️  Clear All Local Data</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Row label="Version" value="1.0.0 (MVP)" />
          <Row label="Model" value="Stub — ML pending" />
          <Text style={styles.about}>
            FindMyCow helps farmers and enthusiasts identify, log, and track
            individual cows using visual characteristics. Think Pokémon GO — for
            cows. 🐄
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
        thumbColor={value ? COLORS.primary : COLORS.muted}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  heading: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    margin: SPACING.md,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  rowLabel: { fontSize: FONT_SIZE.md, color: COLORS.text },
  rowValue: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
  rowDescription: { fontSize: FONT_SIZE.xs, color: COLORS.muted, marginTop: 2 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  dangerBtn: {
    margin: SPACING.md,
    padding: SPACING.md,
    backgroundColor: '#FFEBEE',
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  dangerText: { color: COLORS.error, fontWeight: '700', fontSize: FONT_SIZE.md },
  about: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    margin: SPACING.md,
    lineHeight: 20,
  },
});
