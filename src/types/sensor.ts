export interface SensorReading {
  id?: number;
  waterLevel: number;
  temperature: number;
  tds: number;
  lat: number;
  lng: number;
  timestamp: Date;
  floodStatus: 'normal' | 'warning' | 'flood';
  batteryPct?: number;
  signalRssi?: number;
}

export interface HistoricalDataPoint {
  time: string;
  level: number;
  temp: number;
  tds: number;
}

export interface Settings {
  floodHeight: number;
  updateInterval: number;
  calibrationOffset: number;
}

export interface Command {
  id?: number;
  commandName: string;
  payload: Record<string, unknown>;
  createdAt: Date;
  status: 'pending' | 'sent' | 'completed' | 'failed';
}

export interface Station {
  id: string;
  name: string;
  riverName: string;
  state: string;
  district?: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export type FloodStatus = 'normal' | 'warning' | 'flood';
export type PollutionLevel = 'good' | 'fair' | 'poor';

export const getFloodStatus = (waterLevel: number, threshold = 220): FloodStatus => {
  if (waterLevel > threshold) return 'flood';
  if (waterLevel > threshold * 0.82) return 'warning';
  return 'normal';
};

export const getPollutionLevel = (tds: number): PollutionLevel => {
  if (tds < 300) return 'good';
  if (tds < 600) return 'fair';
  return 'poor';
};
