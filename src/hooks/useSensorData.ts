import { useState, useEffect, useCallback } from 'react';
import { SensorReading, HistoricalDataPoint, getFloodStatus } from '@/types/sensor';

const generateSensorData = (): SensorReading => {
  const baseLevel = 150;
  const variation = Math.sin(Date.now() / 10000) * 50;
  const waterLevel = Math.max(0, baseLevel + variation + (Math.random() - 0.5) * 40);
  
  const temperature = 22 + Math.random() * 10;
  const tds = 150 + Math.random() * 500;
  
  // Simulated location near Hyderabad
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
  const [isSimulated, setIsSimulated] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const updateData = useCallback(() => {
    const newData = generateSensorData();
    setCurrentData(newData);
    setLastUpdated(new Date());
    
    setHistoricalData(prev => {
      const updated = [...prev, {
        time: newData.timestamp.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        level: newData.waterLevel,
        temp: newData.temperature,
        tds: newData.tds
      }];
      return updated.slice(-20);
    });
  }, []);

  useEffect(() => {
    // Initialize with some historical data
    const initialData: HistoricalDataPoint[] = [];
    for (let i = 19; i >= 0; i--) {
      const time = new Date(Date.now() - i * updateInterval);
      const baseLevel = 150 + Math.sin(i / 3) * 30;
      initialData.push({
        time: time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        level: Math.round(baseLevel + (Math.random() - 0.5) * 20),
        temp: Math.round((22 + Math.random() * 8) * 10) / 10,
        tds: Math.round(200 + Math.random() * 300)
      });
    }
    setHistoricalData(initialData);

    const interval = setInterval(updateData, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval, updateData]);

  // Simulate occasional disconnection
  useEffect(() => {
    const disconnectChance = setInterval(() => {
      if (Math.random() < 0.02) {
        setIsConnected(false);
        setTimeout(() => setIsConnected(true), 5000);
      }
    }, 10000);
    return () => clearInterval(disconnectChance);
  }, []);

  return {
    currentData,
    historicalData,
    isConnected,
    isSimulated,
    lastUpdated,
    setIsSimulated,
  };
};
