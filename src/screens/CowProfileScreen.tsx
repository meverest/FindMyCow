// FindMyCow — Cow Profile Screen
// Displays full profile for a single cow: hero photo, features, sighting history.

import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getCows, saveCow } from '../data/storage';
import { Cow } from '../data/models';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';
import { formatDate } from '../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'CowProfile'>;

export default function CowProfileScreen({ route, navigation }: Props) {
  const { cowId } = route.params;
  const [cow, setCow] = useState<Cow | null>(null);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [breed, setBreed] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    const cows = await getCows();
    const found = cows.find((c) => c.id === cowId) ?? null;
    setCow(found);
    if (found) {
      setNickname(found.nickname);
      setBreed(found.breed);
      setNotes(found.notes);
    }
  }, [cowId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation, load]);

  const handleSave = async () => {
    if (!cow) return;
    const updated: Cow = { ...cow, nickname, breed, notes };
    await saveCow(updated);
    setCow(updated);
    setEditing(false);
  };

  if (!cow) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.emptyText}>Cow not found.</Text>
      </SafeAreaView>
    );
  }

  const heroPhoto = cow.photos[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Hero photo */}
        {heroPhoto ? (
          <Image source={{ uri: heroPhoto.uri }} style={styles.hero} resizeMode="cover" />
        ) : (
          <View style={[styles.hero, styles.placeholderHero]}>
            <Text style={{ fontSize: 80 }}>🐄</Text>
          </View>
        )}

        <View style={styles.content}>
          {/* Name & breed */}
          {editing ? (
            <>
              <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Nickname"
                accessibilityLabel="Cow nickname"
              />
              <TextInput
                style={styles.input}
                value={breed}
                onChangeText={setBreed}
                placeholder="Breed"
                accessibilityLabel="Cow breed"
              />
            </>
          ) : (
            <>
              <Text style={styles.name}>{cow.nickname}</Text>
              <View style={styles.breedBadge}>
                <Text style={styles.breedText}>{cow.breed}</Text>
              </View>
            </>
          )}

          {/* Meta info */}
          <Text style={styles.meta}>First seen: {formatDate(cow.dateFirstSeen)}</Text>

          {/* Feature tags */}
          {cow.featureTags.length > 0 && (
            <View style={styles.tagRow}>
              {cow.featureTags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Notes */}
          <Text style={styles.sectionTitle}>Notes</Text>
          {editing ? (
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add observation notes…"
              multiline
              numberOfLines={4}
              accessibilityLabel="Observation notes"
            />
          ) : (
            <Text style={styles.notesText}>
              {cow.notes || 'No notes yet.'}
            </Text>
          )}

          {/* Edit / Save buttons */}
          {editing ? (
            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => setEditing(false)}>
                <Text style={styles.btnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={handleSave}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.btn} onPress={() => setEditing(true)}>
              <Text style={styles.btnText}>✏️  Edit Profile</Text>
            </TouchableOpacity>
          )}

          {/* Sighting history */}
          <Text style={styles.sectionTitle}>
            Sighting History ({cow.sightings.length})
          </Text>
          {cow.sightings.length === 0 ? (
            <Text style={styles.emptyText}>No sightings recorded yet.</Text>
          ) : (
            [...cow.sightings]
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
              )
              .map((s) => (
                <View key={s.id} style={styles.sightingItem}>
                  <Text style={styles.sightingDate}>{formatDate(s.timestamp)}</Text>
                  {s.notes ? (
                    <Text style={styles.sightingNotes}>{s.notes}</Text>
                  ) : null}
                </View>
              ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  hero: {
    width: '100%',
    height: 240,
    backgroundColor: COLORS.border,
  },
  placeholderHero: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: SPACING.md },
  name: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  breedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginBottom: SPACING.sm,
  },
  breedText: { color: COLORS.white, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  meta: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm, marginBottom: SPACING.sm },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: SPACING.md },
  tag: {
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tagText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  notesText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  emptyText: { color: COLORS.muted, fontSize: FONT_SIZE.md },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  notesInput: { height: 100, textAlignVertical: 'top' },
  btnRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  btn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  btnText: { color: COLORS.white, fontWeight: '700', fontSize: FONT_SIZE.md },
  btnSecondary: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.primary },
  btnSecondaryText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZE.md },
  sightingItem: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    paddingLeft: SPACING.md,
    marginBottom: SPACING.md,
  },
  sightingDate: { fontWeight: '700', fontSize: FONT_SIZE.sm, color: COLORS.text },
  sightingNotes: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },
});
