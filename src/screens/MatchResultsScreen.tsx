// FindMyCow — Match Results Screen
// Shows ranked identification candidates after capturing a photo.

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { identifyCow } from '../services/identificationService';
import { saveCow, saveSighting } from '../data/storage';
import { Cow, IdentificationResult, Sighting } from '../data/models';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';
import { generateId, nowISO } from '../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'MatchResults'>;

export default function MatchResultsScreen({ route, navigation }: Props) {
  const { photoUri } = route.params;
  const [results, setResults] = useState<IdentificationResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    identifyCow(photoUri)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [photoUri]);

  const handleConfirmMatch = async (cow: Cow) => {
    const sighting: Sighting = {
      id: generateId(),
      cowId: cow.id,
      fieldId: '',
      userId: 'user-1',
      timestamp: nowISO(),
      notes: '',
      photos: [
        {
          id: generateId(),
          uri: photoUri,
          thumbnailUri: photoUri,
          capturedAt: nowISO(),
          width: 0,
          height: 0,
        },
      ],
    };
    const updated: Cow = {
      ...cow,
      sightings: [...cow.sightings, sighting],
    };
    await saveCow(updated);
    await saveSighting(sighting);
    Alert.alert('Sighting logged!', `${cow.nickname} has been recorded.`, [
      { text: 'View Profile', onPress: () => navigation.replace('CowProfile', { cowId: cow.id }) },
      { text: 'Done', onPress: () => navigation.popToTop() },
    ]);
  };

  const handleNewCow = () => {
    Alert.alert(
      'Register New Cow',
      'This cow will be added to your Herd Book.',
      [
        {
          text: 'Add',
          onPress: async () => {
            const newCow: Cow = {
              id: generateId(),
              nickname: 'New Cow',
              breed: 'Unknown',
              dateFirstSeen: nowISO(),
              farmId: 'farm-1',
              featureTags: [],
              notes: '',
              photos: [
                {
                  id: generateId(),
                  uri: photoUri,
                  thumbnailUri: photoUri,
                  capturedAt: nowISO(),
                  width: 0,
                  height: 0,
                },
              ],
              sightings: [],
            };
            await saveCow(newCow);
            navigation.replace('CowProfile', { cowId: newCow.id });
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Analysing image…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Possible Matches</Text>
      <Text style={styles.subtitle}>
        Select the correct cow, or register as new.
      </Text>

      {results.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No cows in your Herd Book yet.</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.cow.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleConfirmMatch(item.cow)}
              accessibilityLabel={`Select ${item.cow.nickname}`}
            >
              {item.cow.photos[0] ? (
                <Image
                  source={{ uri: item.cow.photos[0].thumbnailUri }}
                  style={styles.thumbnail}
                />
              ) : (
                <View style={[styles.thumbnail, styles.placeholderThumb]}>
                  <Text style={{ fontSize: 32 }}>🐄</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cowName}>{item.cow.nickname}</Text>
                <Text style={styles.cowBreed}>{item.cow.breed}</Text>
                <View style={styles.confidenceBar}>
                  <View
                    style={[
                      styles.confidenceFill,
                      { width: `${Math.round(item.confidence * 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.confidenceLabel}>
                  {Math.round(item.confidence * 100)}% match
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: SPACING.xl }}
        />
      )}

      <TouchableOpacity style={styles.newCowBtn} onPress={handleNewCow}>
        <Text style={styles.newCowText}>➕  This is a New Cow</Text>
      </TouchableOpacity>
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
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginHorizontal: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  emptyText: { color: COLORS.muted, fontSize: FONT_SIZE.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.md,
  },
  placeholderThumb: {
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1 },
  cowName: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  cowBreed: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  confidenceBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: 2,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  confidenceLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  arrow: { fontSize: FONT_SIZE.xl, color: COLORS.muted, marginLeft: SPACING.sm },
  newCowBtn: {
    margin: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  newCowText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
});
