// FindMyCow — Home / Camera Screen
// Primary screen: full-screen camera viewfinder with an "Identify" button.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      navigation.navigate('Preview', { photoUri: photo?.uri ?? '' });
    } catch {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setCapturing(false);
    }
  }, [navigation]);

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.permissionText}>
          FindMyCow needs camera access to identify cows.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        {/* Overlay */}
        <View style={styles.overlay}>
          <Text style={styles.hint}>Centre the cow's face in the frame</Text>
          {/* Guided rectangle */}
          <View style={styles.guideFrame} />
          <TouchableOpacity
            style={[styles.captureBtn, capturing && styles.captureBtnDisabled]}
            onPress={handleCapture}
            disabled={capturing}
            accessibilityLabel="Capture photo"
          >
            {capturing ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.captureBtnText}>📷 Capture</Text>
            )}
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xl + SPACING.lg,
    paddingBottom: SPACING.xl + SPACING.lg,
  },
  guideFrame: {
    width: 260,
    height: 200,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: RADIUS.md,
    backgroundColor: 'transparent',
  },
  hint: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  captureBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    minWidth: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  captureBtnDisabled: { opacity: 0.7 },
  captureBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  permissionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  btn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  btnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});
