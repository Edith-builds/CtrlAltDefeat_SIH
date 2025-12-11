import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SensorReading, HistoricalDataPoint, getFloodStatus } from '@/types/sensor';

const getDefaultSensorData = (): SensorReading => ({
  waterLevel: 0,
  temperature: 0,
  tds: 0,
  lat: 0,
  lng: 0,
  timestamp: new Date(),
  floodStatus: 'normal',
  batteryPct: 0,
  signalRssi: -100,
});

export const useSensorData = (updateInterval = 3000) => {
  const [currentData, setCurrentData] = useState<SensorReading>(getDefaultSensorData());
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch latest readings from Supabase
  const fetchLatestReading = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const reading: SensorReading = {
          waterLevel: Number(data.water_level),
          temperature: Number(data.temperature),
          tds: data.tds,
          lat: Number(data.lat),
          lng: Number(data.lng),
          timestamp: new Date(data.recorded_at),
          floodStatus: getFloodStatus(Number(data.water_level)),
          batteryPct: data.battery_pct ?? 100,
          signalRssi: data.signal_rssi ?? -70,
        };
        setCurrentData(reading);
        setLastUpdated(new Date(data.recorded_at));
        setIsConnected(true);
        return true;
      }
      setIsConnected(false);
      return false;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setIsConnected(false);
      return false;
    }
  }, []);

  // Fetch historical readings
  const fetchHistoricalData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (data && data.length > 0) {
        const historical: HistoricalDataPoint[] = data
          .reverse()
          .map((reading) => ({
            time: new Date(reading.recorded_at).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            level: Number(reading.water_level),
            temp: Number(reading.temperature),
            tds: reading.tds,
          }));
        setHistoricalData(historical);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return false;
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const initData = async () => {
      await fetchLatestReading();
      await fetchHistoricalData();
    };
    initData();
  }, [fetchLatestReading, fetchHistoricalData]);

  // Polling interval
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchLatestReading();
      await fetchHistoricalData();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval, fetchLatestReading, fetchHistoricalData]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('sensor-readings-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings',
        },
        async () => {
          await fetchLatestReading();
          await fetchHistoricalData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLatestReading, fetchHistoricalData]);

  return {
    currentData,
    historicalData,
    isConnected,
    lastUpdated,
  };
};
