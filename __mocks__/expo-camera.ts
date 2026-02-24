// Mock for expo-camera
const CameraView = 'CameraView';

const useCameraPermissions = jest.fn(() => [
  { granted: true, canAskAgain: true, expires: 'never', status: 'granted' },
  jest.fn(),
]);

export { CameraView, useCameraPermissions };
