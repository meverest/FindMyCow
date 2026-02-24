// Integration tests for the CowDexScreen component
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { getCows } from '../src/data/storage';
import CowDexScreen from '../src/screens/CowDexScreen';
import type { Cow } from '../src/data/models';

// Navigation mock
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  const { useEffect } = require('react');
  return {
    ...actual,
    useNavigation: () => ({ navigate: jest.fn() }),
    useFocusEffect: (cb: () => void) => {
      useEffect(cb, []);
    },
  };
});

// Mock storage layer so tests don't depend on AsyncStorage internals
jest.mock('../src/data/storage');
const mockGetCows = getCows as jest.MockedFunction<typeof getCows>;

const makeCow = (id: string, hasSighting = false): Cow => ({
  id,
  nickname: `Cow ${id}`,
  breed: 'Holstein',
  dateFirstSeen: '2024-01-01T00:00:00Z',
  farmId: 'farm-1',
  featureTags: [],
  notes: '',
  photos: [],
  sightings: hasSighting
    ? [
        {
          id: `sighting-${id}`,
          cowId: id,
          fieldId: 'field-1',
          userId: 'user-1',
          timestamp: '2024-01-01T00:00:00Z',
          notes: '',
          photos: [],
        },
      ]
    : [],
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CowDexScreen', () => {
  it('shows empty-state message when no cows are stored', async () => {
    mockGetCows.mockResolvedValueOnce([]);
    render(<CowDexScreen />);
    await waitFor(() => {
      expect(screen.getByText('Your CowDex is empty')).toBeTruthy();
    });
  });

  it('shows catalogued cows count', async () => {
    const cows = [makeCow('cow-1'), makeCow('cow-2')];
    mockGetCows.mockResolvedValueOnce(cows);
    render(<CowDexScreen />);
    await waitFor(() => {
      expect(screen.getByText('2 cows catalogued')).toBeTruthy();
    });
  });

  it('unlocks the "First Cow Found" achievement with one cow', async () => {
    const cows = [makeCow('cow-1')];
    mockGetCows.mockResolvedValueOnce(cows);
    render(<CowDexScreen />);
    await waitFor(() => {
      expect(screen.getByText('First Cow Found 🎉')).toBeTruthy();
    });
  });

  it('displays the correct singular "cow" label for one cow', async () => {
    const cows = [makeCow('cow-1')];
    mockGetCows.mockResolvedValueOnce(cows);
    render(<CowDexScreen />);
    await waitFor(() => {
      expect(screen.getByText('1 cow catalogued')).toBeTruthy();
    });
  });
});
