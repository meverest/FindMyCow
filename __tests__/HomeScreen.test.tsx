// Integration tests for the HomeScreen component
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

// Navigation mock
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: jest.fn() }),
  };
});

// expo-camera is auto-mocked via __mocks__/expo-camera.ts

import HomeScreen from '../src/screens/HomeScreen';

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Identify button when camera permission is granted', async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByText('🔍 Identify')).toBeTruthy();
    });
  });

  it('shows the camera hint text', async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByText('Point at a cow and tap Identify')).toBeTruthy();
    });
  });

  it('shows permission request screen when permission is not granted', async () => {
    const { useCameraPermissions } = require('expo-camera');
    (useCameraPermissions as jest.Mock).mockReturnValueOnce([
      { granted: false, canAskAgain: true, expires: 'never', status: 'denied' },
      jest.fn(),
    ]);
    render(<HomeScreen />);
    await waitFor(() => {
      expect(
        screen.getByText('FindMyCow needs camera access to identify cows.'),
      ).toBeTruthy();
    });
  });

  it('shows Grant Permission button when permission is not granted', async () => {
    const { useCameraPermissions } = require('expo-camera');
    (useCameraPermissions as jest.Mock).mockReturnValueOnce([
      { granted: false, canAskAgain: true, expires: 'never', status: 'denied' },
      jest.fn(),
    ]);
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByText('Grant Permission')).toBeTruthy();
    });
  });
});
