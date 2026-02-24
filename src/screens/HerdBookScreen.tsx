// FindMyCow — Herd Book Screen
// Grid/list view of all catalogued cows with search and filter.

import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getCows } from '../data/storage';
import { Cow } from '../data/models';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';
import { formatDate } from '../utils';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HerdBookScreen() {
  const navigation = useNavigation<Nav>();
  const [cows, setCows] = useState<Cow[]>([]);
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      getCows().then(setCows);
    }, []),
  );

  const filtered = cows.filter(
    (c) =>
      c.nickname.toLowerCase().includes(query.toLowerCase()) ||
      c.breed.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Herd Book</Text>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or breed…"
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
          accessibilityLabel="Search cows"
        />
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📖</Text>
          <Text style={styles.emptyTitle}>
            {cows.length === 0 ? 'No cows yet' : 'No results'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {cows.length === 0
              ? 'Use the Camera tab to identify and catalog your first cow.'
              : 'Try a different search term.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ padding: SPACING.sm, paddingBottom: SPACING.xl }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('CowProfile', { cowId: item.id })}
              accessibilityLabel={`View ${item.nickname}`}
            >
              {item.photos[0] ? (
                <Image
                  source={{ uri: item.photos[0].thumbnailUri }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.cardImage, styles.placeholder]}>
                  <Text style={{ fontSize: 40 }}>🐄</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {item.nickname}
                </Text>
                <Text style={styles.cardBreed} numberOfLines={1}>
                  {item.breed}
                </Text>
                <Text style={styles.cardDate}>
                  {formatDate(item.dateFirstSeen)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  heading: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  searchRow: { marginHorizontal: SPACING.md, marginBottom: SPACING.sm },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  row: { justifyContent: 'space-between' },
  card: {
    flex: 1,
    margin: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: { width: '100%', height: 110 },
  placeholder: {
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { padding: SPACING.sm },
  cardName: { fontWeight: '700', fontSize: FONT_SIZE.md, color: COLORS.text },
  cardBreed: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  cardDate: { fontSize: FONT_SIZE.xs, color: COLORS.muted, marginTop: 2 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyEmoji: { fontSize: 64, marginBottom: SPACING.md },
  emptyTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  emptySubtitle: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, textAlign: 'center' },
});
