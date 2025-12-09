import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SensorReading, HistoricalDataPoint, getFloodStatus } from '@/types/sensor';

const generateSensorData = (): SensorReading => {
  const baseLevel = 150;
  const variation = Math.sin(Date.now() / 10000) * 50;
  const waterLevel = Math.max(0, baseLevel + variation + (Math.random() - 0.5) * 40);
  
  const temperature = 22 + Math.random() * 10;
  const tds = 150 + Math.random() * 500;
  
  const lat = 17.385 + (Math.random() - 0.5) * 0.01;
  const lng = 78.486 + (Math.random() - 0.5) * 0.01;
  
  return {
    waterLevel: Math.round(waterLevel),
    temperature: Math.round(temperature * 10) / 10,
    tds: Math.round(tds),
    lat: parseFloat(lat.toFixed(6)),
    lng: parseFloat(lng.toFixed(6)),
    timestamp: new Date(),
    floodStatus: getFloodStatus(waterLevel),
    batteryPct: Math.round(70 + Math.random() * 25),
    signalRssi: Math.round(-90 + Math.random() * 40),
  };
};

export const useSensorData = (updateInterval = 3000) => {
  const [currentData, setCurrentData] = useState<SensorReading>(generateSensorData());
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

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

  // Insert simulated data into Supabase
  const insertSimulatedData = useCallback(async () => {
    const newData = generateSensorData();
    
    try {
      const { error } = await supabase.from('sensor_readings').insert({
        water_level: newData.waterLevel,
        temperature: newData.temperature,
        tds: newData.tds,
        lat: newData.lat,
        lng: newData.lng,
        battery_pct: newData.batteryPct,
        signal_rssi: newData.signalRssi,
        flood_status: newData.floodStatus,
        recorded_at: new Date().toISOString(),
      });

      if (error) throw error;
      
      await fetchLatestReading();
      await fetchHistoricalData();
    } catch (error) {
      console.error('Error inserting simulated data:', error);
    }
  }, [fetchLatestReading, fetchHistoricalData]);

  // Initial data fetch
  useEffect(() => {
    const initData = async () => {
      const hasData = await fetchLatestReading();
      await fetchHistoricalData();
      
      // If no data in DB, enable simulation mode
      if (!hasData) {
        setIsSimulated(true);
      }
    };
    initData();
  }, [fetchLatestReading, fetchHistoricalData]);

  // Polling or simulation interval
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isSimulated) {
        await insertSimulatedData();
      } else {
        await fetchLatestReading();
        await fetchHistoricalData();
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval, isSimulated, insertSimulatedData, fetchLatestReading, fetchHistoricalData]);

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
    isSimulated,
    lastUpdated,
    setIsSimulated,
  };
};
