// Unit tests for PreviewScreen

import React from 'react';
import { Image } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock expo-camera so the test environment doesn't need native modules
jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  useCameraPermissions: jest.fn(() => [{ granted: true }, jest.fn()]),
}));

// Stub navigation hooks
const mockGoBack = jest.fn();
const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: mockGoBack, replace: mockReplace }),
}));

// Provide a minimal navigation prop for the screen
const buildProps = (photoUri = 'file://test.jpg') => ({
  route: { key: 'Preview', name: 'Preview' as const, params: { photoUri } },
  navigation: {
    goBack: mockGoBack,
    replace: mockReplace,
  } as unknown as import('@react-navigation/native-stack').NativeStackNavigationProp<
    import('../src/navigation/AppNavigator').RootStackParamList,
    'Preview'
  >,
});

import PreviewScreen from '../src/screens/PreviewScreen';

beforeEach(() => {
  jest.clearAllMocks();
  // Provide real dimensions for Image.getSize in tests
  jest.spyOn(Image, 'getSize').mockImplementation((_uri, success) => {
    success(800, 600);
  });
});

describe('PreviewScreen', () => {
  it('renders the captured image', () => {
    const { getByLabelText } = render(<PreviewScreen {...buildProps()} />);
    expect(getByLabelText('Captured photo preview')).toBeTruthy();
  });

  it('renders Discard and Identify buttons', () => {
    const { getByLabelText } = render(<PreviewScreen {...buildProps()} />);
    expect(getByLabelText('Discard photo')).toBeTruthy();
    expect(getByLabelText('Identify cow')).toBeTruthy();
  });

  it('calls navigation.goBack when Discard is pressed', () => {
    const { getByLabelText } = render(<PreviewScreen {...buildProps()} />);
    fireEvent.press(getByLabelText('Discard photo'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('saves photo and navigates to MatchResults when Identify is pressed', async () => {
    const uri = 'file://cow-photo.jpg';
    const { getByLabelText } = render(<PreviewScreen {...buildProps(uri)} />);
    fireEvent.press(getByLabelText('Identify cow'));
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('MatchResults', { photoUri: uri });
    });
  });

  it('shows an alert when saving fails', async () => {
    jest.spyOn(Image, 'getSize').mockImplementationOnce((_uri, _success, failure) => {
      failure?.(new Error('getSize failed'));
    });
    const alertSpy = jest.spyOn(require('react-native').Alert, 'alert');
    const { getByLabelText } = render(<PreviewScreen {...buildProps()} />);
    fireEvent.press(getByLabelText('Identify cow'));
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Failed to save photo. Please try again.');
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
