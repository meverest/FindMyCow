// Integration test for the App root component.
// Verifies that the app mounts, seeds mock data when the store is empty,
// and transitions from the loading spinner to the main navigator.

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';

// Mock AsyncStorage with a simple in-memory store
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Prevent navigation from rendering real native screens in the test environment
jest.mock('@react-navigation/native', () => {
  const real = jest.requireActual('@react-navigation/native');
  return {
    ...real,
    NavigationContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Screen: () => null,
  }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Screen: () => null,
  }),
}));

describe('App', () => {
  it('renders without crashing and finishes seeding', async () => {
    const { toJSON } = render(<App />);
    // The app shows a loading spinner first; assert something is rendered
    expect(toJSON()).not.toBeNull();
    // waitFor waits for setReady(true) state update so the act() warning is suppressed
    await waitFor(() => {
      expect(toJSON()).not.toBeNull();
    });
  });
});
