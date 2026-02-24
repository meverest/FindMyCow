// Unit tests for the AsyncStorage-backed storage helpers
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getCows,
  saveCow,
  deleteCow,
  getSightings,
  saveSighting,
  getFarms,
  saveFarm,
  getFields,
  saveField,
} from '../src/data/storage';
import type { Cow, Sighting, Farm, Field } from '../src/data/models';

const makeCow = (id: string): Cow => ({
  id,
  nickname: `Cow ${id}`,
  breed: 'Holstein',
  dateFirstSeen: '2024-01-01T00:00:00Z',
  farmId: 'farm-1',
  featureTags: [],
  notes: '',
  photos: [],
  sightings: [],
});

const makeSighting = (id: string, cowId: string): Sighting => ({
  id,
  cowId,
  fieldId: 'field-1',
  userId: 'user-1',
  timestamp: '2024-01-01T00:00:00Z',
  notes: '',
  photos: [],
});

const makeFarm = (id: string): Farm => ({
  id,
  name: `Farm ${id}`,
  locationDescription: 'Test location',
  fields: [],
});

const makeField = (id: string): Field => ({
  id,
  name: `Field ${id}`,
  farmId: 'farm-1',
});

beforeEach(() => {
  (AsyncStorage.clear as jest.Mock).mockClear();
  jest.clearAllMocks();
  // Reset the in-memory store between tests
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
});

// ─── Cows ─────────────────────────────────────────────────────────────────────

describe('getCows', () => {
  it('returns an empty array when no cows are stored', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const cows = await getCows();
    expect(cows).toEqual([]);
  });

  it('returns parsed cows from storage', async () => {
    const stored = [makeCow('cow-1')];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(stored));
    const cows = await getCows();
    expect(cows).toEqual(stored);
  });
});

describe('saveCow', () => {
  it('saves a new cow to storage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const cow = makeCow('cow-1');
    await saveCow(cow);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'findmycow:cows',
      JSON.stringify([cow]),
    );
  });

  it('updates an existing cow', async () => {
    const original = makeCow('cow-1');
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([original]),
    );
    const updated = { ...original, nickname: 'Bessie Updated' };
    await saveCow(updated);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'findmycow:cows',
      JSON.stringify([updated]),
    );
  });
});

describe('deleteCow', () => {
  it('removes a cow by id', async () => {
    const cows = [makeCow('cow-1'), makeCow('cow-2')];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(cows));
    await deleteCow('cow-1');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'findmycow:cows',
      JSON.stringify([cows[1]]),
    );
  });
});

// ─── Sightings ────────────────────────────────────────────────────────────────

describe('getSightings', () => {
  it('returns an empty array when no sightings are stored', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const sightings = await getSightings();
    expect(sightings).toEqual([]);
  });
});

describe('saveSighting', () => {
  it('saves a new sighting to storage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const sighting = makeSighting('s-1', 'cow-1');
    await saveSighting(sighting);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'findmycow:sightings',
      JSON.stringify([sighting]),
    );
  });
});

// ─── Farms ────────────────────────────────────────────────────────────────────

describe('getFarms', () => {
  it('returns an empty array when no farms are stored', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const farms = await getFarms();
    expect(farms).toEqual([]);
  });
});

describe('saveFarm', () => {
  it('saves a new farm', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const farm = makeFarm('farm-1');
    await saveFarm(farm);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'findmycow:farms',
      JSON.stringify([farm]),
    );
  });
});

// ─── Fields ───────────────────────────────────────────────────────────────────

describe('getFields', () => {
  it('returns an empty array when no fields are stored', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const fields = await getFields();
    expect(fields).toEqual([]);
  });
});

describe('saveField', () => {
  it('saves a new field', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const field = makeField('field-1');
    await saveField(field);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'findmycow:fields',
      JSON.stringify([field]),
    );
  });
});
