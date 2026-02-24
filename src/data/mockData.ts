// FindMyCow — Mock / Seed Data
// Provides realistic sample cows and farms so the UI is immediately useful.

import { Cow, Farm, Field, Sighting } from './models';

export const MOCK_FIELDS: Field[] = [
  { id: 'field-1', farmId: 'farm-1', name: 'North Paddock' },
  { id: 'field-2', farmId: 'farm-1', name: 'South Meadow' },
  { id: 'field-3', farmId: 'farm-1', name: 'East Pasture' },
];

export const MOCK_FARMS: Farm[] = [
  {
    id: 'farm-1',
    name: 'Greenhill Farm',
    locationDescription: 'County Cork, Ireland',
    fields: MOCK_FIELDS,
  },
];

export const MOCK_COWS: Cow[] = [
  {
    id: 'cow-1',
    nickname: 'Bessie',
    breed: 'Holstein Friesian',
    dateFirstSeen: '2024-03-15T09:00:00Z',
    farmId: 'farm-1',
    featureTags: ['black-and-white', 'large-spot-left-flank', 'no-ear-tag'],
    notes: 'Very friendly. Often found near the water trough.',
    photos: [
      {
        id: 'img-1',
        uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Cow_female_black_white.jpg/320px-Cow_female_black_white.jpg',
        thumbnailUri:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Cow_female_black_white.jpg/160px-Cow_female_black_white.jpg',
        capturedAt: '2024-03-15T09:00:00Z',
        width: 320,
        height: 213,
      },
    ],
    sightings: [
      {
        id: 'sighting-1',
        cowId: 'cow-1',
        fieldId: 'field-1',
        userId: 'user-1',
        timestamp: '2024-03-15T09:00:00Z',
        notes: 'First sighting.',
        photos: [],
      },
      {
        id: 'sighting-2',
        cowId: 'cow-1',
        fieldId: 'field-2',
        userId: 'user-1',
        timestamp: '2024-06-01T14:30:00Z',
        notes: 'Spotted grazing near the fence.',
        photos: [],
      },
    ],
  },
  {
    id: 'cow-2',
    nickname: 'Rusty',
    breed: 'Hereford',
    dateFirstSeen: '2024-04-02T11:15:00Z',
    farmId: 'farm-1',
    featureTags: ['red-brown', 'white-face', 'yellow-ear-tag-left'],
    notes: 'Has a distinctive white blaze on forehead.',
    photos: [
      {
        id: 'img-2',
        uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Hereford_bull_large.jpg/320px-Hereford_bull_large.jpg',
        thumbnailUri:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Hereford_bull_large.jpg/160px-Hereford_bull_large.jpg',
        capturedAt: '2024-04-02T11:15:00Z',
        width: 320,
        height: 240,
      },
    ],
    sightings: [
      {
        id: 'sighting-3',
        cowId: 'cow-2',
        fieldId: 'field-3',
        userId: 'user-1',
        timestamp: '2024-04-02T11:15:00Z',
        notes: 'First sighting. Appears healthy.',
        photos: [],
      },
    ],
  },
  {
    id: 'cow-3',
    nickname: 'Daisy',
    breed: 'Jersey',
    dateFirstSeen: '2024-05-10T08:45:00Z',
    farmId: 'farm-1',
    featureTags: ['fawn', 'dark-muzzle', 'small-frame'],
    notes: 'High milk producer. Very calm temperament.',
    photos: [],
    sightings: [
      {
        id: 'sighting-4',
        cowId: 'cow-3',
        fieldId: 'field-2',
        userId: 'user-1',
        timestamp: '2024-05-10T08:45:00Z',
        notes: 'First sighting.',
        photos: [],
      },
    ],
  },
  {
    id: 'cow-4',
    nickname: 'Angus',
    breed: 'Aberdeen Angus',
    dateFirstSeen: '2024-07-20T16:00:00Z',
    farmId: 'farm-1',
    featureTags: ['solid-black', 'polled', 'large-frame'],
    notes: 'Bull. Keep gate closed.',
    photos: [],
    sightings: [],
  },
  {
    id: 'cow-5',
    nickname: 'Patches',
    breed: 'Simmental',
    dateFirstSeen: '2024-08-05T10:20:00Z',
    farmId: 'farm-1',
    featureTags: ['cream-and-red', 'spotted', 'blue-ear-tag-right'],
    notes: 'Recently joined the herd from neighbouring farm.',
    photos: [],
    sightings: [],
  },
];

export const MOCK_SIGHTINGS: Sighting[] = MOCK_COWS.flatMap((c) => c.sightings);
