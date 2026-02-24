// FindMyCow — Identification Service (Stub)
// Simulates the ML-based cow identification backend.
// Replace with real on-device or cloud ML calls when the model is available.

import { Cow, IdentificationResult } from '../data/models';
import { getCows } from '../data/storage';

/**
 * Simulates identifying a cow from a photo URI.
 * Returns a ranked list of candidate cows with mock confidence scores.
 * In production this will call the on-device ML model or the cloud REST API.
 */
export async function identifyCow(
  _photoUri: string,
): Promise<IdentificationResult[]> {
  // Simulate network / model latency
  await delay(1200);

  const cows = await getCows();
  if (cows.length === 0) return [];

  // Assign random confidence scores and sort highest first
  const results: IdentificationResult[] = cows.map((cow) => ({
    cow,
    confidence: parseFloat((Math.random() * 0.6 + 0.4).toFixed(2)), // 0.40–1.00
  }));

  results.sort((a, b) => b.confidence - a.confidence);
  return results;
}

/**
 * Generates a stub feature-tag list from an image.
 * Replace with real feature-extraction logic later.
 */
export async function extractFeatureTags(_photoUri: string): Promise<string[]> {
  await delay(600);
  const stubTags = [
    'unclassified-coat',
    'medium-frame',
    'unknown-markings',
  ];
  return stubTags;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
