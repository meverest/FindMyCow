// FindMyCow — Preview Screen
// Displays the just-captured photo so the user can choose to identify or discard it.

import React, { useCallback, useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { saveCapturedPhoto } from '../data/storage';
import { generateId, nowISO } from '../utils';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Preview'>;

export default function PreviewScreen({ route, navigation }: Props) {
  const { photoUri } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [saving, setSaving] = React.useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleIdentify = useCallback(async () => {
    setSaving(true);
    try {
      const { width, height } = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => Image.getSize(photoUri, (w, h) => resolve({ width: w, height: h }), reject),
      );
      await saveCapturedPhoto({
        id: generateId(),
        uri: photoUri,
        thumbnailUri: photoUri,
        capturedAt: nowISO(),
        width,
        height,
      });
      navigation.replace('MatchResults', { photoUri });
    } catch {
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [navigation, photoUri]);

  const handleDiscard = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image
        source={{ uri: photoUri }}
        style={styles.preview}
        resizeMode="contain"
        accessibilityLabel="Captured photo preview"
      />
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.discardBtn]}
          onPress={handleDiscard}
          disabled={saving}
          accessibilityLabel="Discard photo"
        >
          <Text style={styles.discardText}>✕  Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.identifyBtn, saving && styles.btnDisabled]}
          onPress={handleIdentify}
          disabled={saving}
          accessibilityLabel="Identify cow"
        >
          {saving ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.identifyText}>🔍  Identify</Text>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  preview: { flex: 1 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  btn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
  },
  discardBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  identifyBtn: {
    backgroundColor: COLORS.primary,
  },
  btnDisabled: { opacity: 0.7 },
  discardText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
  identifyText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
});
