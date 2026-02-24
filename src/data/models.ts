// FindMyCow — Data Model Types
// Mirrors the high-level data model defined in PRF.md §9

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'owner' | 'manager' | 'viewer';
}

export interface Farm {
  id: string;
  name: string;
  locationDescription: string;
  fields: Field[];
}

export interface Field {
  id: string;
  name: string;
  farmId: string;
  gpsBoundary?: GeoJsonPolygon;
}

export interface GeoJsonPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface Cow {
  id: string;
  nickname: string;
  breed: string;
  dateFirstSeen: string; // ISO 8601
  farmId: string;
  featureTags: string[];
  notes: string;
  photos: Image[];
  sightings: Sighting[];
}

export interface Sighting {
  id: string;
  cowId: string;
  fieldId: string;
  userId: string;
  timestamp: string; // ISO 8601
  notes: string;
  photos: Image[];
}

export interface Image {
  id: string;
  uri: string;
  thumbnailUri: string;
  capturedAt: string; // ISO 8601
  width: number;
  height: number;
}

export interface IdentificationResult {
  cow: Cow;
  confidence: number; // 0–1
}
