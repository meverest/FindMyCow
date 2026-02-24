// FindMyCow — CowDex Screen
// Pokédex-inspired grid showing all catalogued cows with progress tracking.

import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getCows } from '../data/storage';
import { Cow } from '../data/models';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ACHIEVEMENTS = [
  { id: 'first', label: 'First Cow Found 🎉', threshold: 1 },
  { id: 'five', label: '5-Cow Club 🌟', threshold: 5 },
  { id: 'ten', label: '10-Cow Club 🏆', threshold: 10 },
  { id: 'fifty', label: '50-Cow Club 👑', threshold: 50 },
];

export default function CowDexScreen() {
  const navigation = useNavigation<Nav>();
  const [cows, setCows] = useState<Cow[]>([]);

  useFocusEffect(
    useCallback(() => {
      getCows().then(setCows);
    }, []),
  );

  const total = cows.length;
  const sighted = cows.filter((c) => c.sightings.length > 0).length;
  const progressPct = total === 0 ? 0 : Math.round((sighted / total) * 100);

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => total >= a.threshold);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>🐄 CowDex</Text>
        <Text style={styles.subheading}>
          {total} {total === 1 ? 'cow' : 'cows'} catalogued
        </Text>

        {/* Progress bar */}
        <View style={styles.progressWrap}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {sighted} of {total} sighted this session
        </Text>
      </View>

      {/* Achievements */}
      {unlockedAchievements.length > 0 && (
        <View style={styles.achievementsRow}>
          {unlockedAchievements.map((a) => (
            <View key={a.id} style={styles.badge}>
              <Text style={styles.badgeText}>{a.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Grid */}
      {total === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Your CowDex is empty</Text>
          <Text style={styles.emptySubtitle}>
            Identify cows with the Camera to fill your CowDex!
          </Text>
        </View>
      ) : (
        <FlatList
          data={cows}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={{ padding: SPACING.sm, paddingBottom: SPACING.xl }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.cell}
              onPress={() => navigation.navigate('CowProfile', { cowId: item.id })}
              accessibilityLabel={`View ${item.nickname} in CowDex`}
            >
              {item.photos[0] ? (
                <Image
                  source={{ uri: item.photos[0].thumbnailUri }}
                  style={styles.cellImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.cellImage, styles.cellPlaceholder]}>
                  <Text style={{ fontSize: 28 }}>🐄</Text>
                </View>
              )}
              <Text style={styles.cellIndex}>#{String(index + 1).padStart(3, '0')}</Text>
              <Text style={styles.cellName} numberOfLines={1}>
                {item.nickname}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  heading: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.white,
  },
  subheading: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    opacity: 0.85,
    marginBottom: SPACING.sm,
  },
  progressWrap: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
  },
  progressLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.white,
    opacity: 0.8,
  },
  achievementsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.sm,
    gap: SPACING.xs,
  },
  badge: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  badgeText: { fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.text },
  gridRow: { justifyContent: 'space-between' },
  cell: {
    flex: 1,
    margin: SPACING.xs,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: SPACING.xs,
  },
  cellImage: { width: '100%', height: 80 },
  cellPlaceholder: {
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellIndex: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.muted,
    marginTop: 4,
  },
  cellName: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyEmoji: { fontSize: 64, marginBottom: SPACING.md },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
