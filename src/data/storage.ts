// FindMyCow — Offline Storage Layer (AsyncStorage wrapper)
// Provides simple CRUD helpers for the core entities.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cow, Sighting, Farm, Field } from './models';

const KEYS = {
  COWS: 'findmycow:cows',
  FARMS: 'findmycow:farms',
  FIELDS: 'findmycow:fields',
  SIGHTINGS: 'findmycow:sightings',
};

// ─── Generic helpers ─────────────────────────────────────────────────────────

async function getAll<T>(key: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T[]) : [];
}

async function saveAll<T>(key: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

// ─── Cows ─────────────────────────────────────────────────────────────────────

export async function getCows(): Promise<Cow[]> {
  return getAll<Cow>(KEYS.COWS);
}

export async function saveCow(cow: Cow): Promise<void> {
  const cows = await getCows();
  const idx = cows.findIndex((c) => c.id === cow.id);
  if (idx >= 0) {
    cows[idx] = cow;
  } else {
    cows.push(cow);
  }
  await saveAll(KEYS.COWS, cows);
}

export async function deleteCow(id: string): Promise<void> {
  const cows = await getCows();
  await saveAll(
    KEYS.COWS,
    cows.filter((c) => c.id !== id),
  );
}

// ─── Sightings ────────────────────────────────────────────────────────────────

export async function getSightings(): Promise<Sighting[]> {
  return getAll<Sighting>(KEYS.SIGHTINGS);
}

export async function saveSighting(sighting: Sighting): Promise<void> {
  const sightings = await getSightings();
  const idx = sightings.findIndex((s) => s.id === sighting.id);
  if (idx >= 0) {
    sightings[idx] = sighting;
  } else {
    sightings.push(sighting);
  }
  await saveAll(KEYS.SIGHTINGS, sightings);
}

// ─── Farms ────────────────────────────────────────────────────────────────────

export async function getFarms(): Promise<Farm[]> {
  return getAll<Farm>(KEYS.FARMS);
}

export async function saveFarm(farm: Farm): Promise<void> {
  const farms = await getFarms();
  const idx = farms.findIndex((f) => f.id === farm.id);
  if (idx >= 0) {
    farms[idx] = farm;
  } else {
    farms.push(farm);
  }
  await saveAll(KEYS.FARMS, farms);
}

// ─── Fields ───────────────────────────────────────────────────────────────────

export async function getFields(): Promise<Field[]> {
  return getAll<Field>(KEYS.FIELDS);
}

export async function saveField(field: Field): Promise<void> {
  const fields = await getFields();
  const idx = fields.findIndex((f) => f.id === field.id);
  if (idx >= 0) {
    fields[idx] = field;
  } else {
    fields.push(field);
  }
  await saveAll(KEYS.FIELDS, fields);
}

// ─── Seed / Reset ─────────────────────────────────────────────────────────────

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
