import { useState } from 'react';
import { Droplets, Thermometer, Activity, MapPin } from 'lucide-react';
import { useSensorData } from '@/hooks/useSensorData';
import { useTheme } from '@/hooks/useTheme';
import { getPollutionLevel } from '@/types/sensor';
import { Header } from '@/components/dashboard/Header';
import { FloodStatusCard } from '@/components/dashboard/FloodStatusCard';
import { SensorCard } from '@/components/dashboard/SensorCard';
import { WaterQualityGauge } from '@/components/dashboard/WaterQualityGauge';
import { WaterLevelChart } from '@/components/dashboard/WaterLevelChart';
import { TempTdsChart } from '@/components/dashboard/TempTdsChart';
import { CommandSidebar } from '@/components/dashboard/CommandSidebar';
import { MapPanel } from '@/components/dashboard/MapPanel';
import { EventLog } from '@/components/dashboard/EventLog';
import { StatusFooter } from '@/components/dashboard/StatusFooter';
import { cn } from '@/lib/utils';

const Index = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentData, historicalData, isConnected, isSimulated, lastUpdated } = useSensorData(3000);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pollutionLevel = getPollutionLevel(currentData.tds);
  const pollutionLabels = { good: 'Good quality', fair: 'Fair quality', poor: 'Poor quality' };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Command Sidebar */}
      <CommandSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className={cn('flex-1 flex flex-col transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-16')}>
        {/* Header */}
        <Header
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          isConnected={isConnected}
          isSimulated={isSimulated}
          lastUpdated={lastUpdated}
          onSettingsClick={() => {}}
        />

        {/* Main Dashboard Content */}
        <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
          {/* Flood Status Alert */}
          <section className="animate-slide-up">
            <FloodStatusCard
              status={currentData.floodStatus}
              waterLevel={currentData.waterLevel}
            />
          </section>

          {/* Sensor Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ animationDelay: '0.1s' }}>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <SensorCard
                title="Water Level"
                value={currentData.waterLevel}
                unit="cm"
                icon={Droplets}
                subtitle="Safe range: 0-180 cm"
                colorClass="text-water"
                bgClass="bg-water-light/30"
                progress={{
                  value: currentData.waterLevel,
                  max: 250,
                  colorClass: currentData.floodStatus === 'flood' 
                    ? 'bg-status-danger' 
                    : currentData.floodStatus === 'warning'
                    ? 'bg-status-warning'
                    : 'bg-status-safe'
                }}
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <SensorCard
                title="Temperature"
                value={currentData.temperature}
                unit="°C"
                icon={Thermometer}
                subtitle="Ambient water temperature"
                colorClass="text-temp"
                bgClass="bg-temp-light/30"
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <SensorCard
                title="TDS Level"
                value={currentData.tds}
                unit="ppm"
                icon={Activity}
                subtitle={pollutionLabels[pollutionLevel]}
                colorClass="text-tds"
                bgClass="bg-tds-light/30"
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <SensorCard
                title="GPS Location"
                value={`${currentData.lat.toFixed(4)}°N`}
                unit=""
                icon={MapPin}
                subtitle={`${currentData.lng.toFixed(4)}°E`}
                colorClass="text-gps"
                bgClass="bg-gps-light/30"
              >
                <a
                  href={`https://www.google.com/maps?q=${currentData.lat},${currentData.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center text-sm text-primary hover:underline"
                >
                  View on map →
                </a>
              </SensorCard>
            </div>
          </section>

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <WaterLevelChart data={historicalData} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
              <TempTdsChart data={historicalData} />
            </div>
          </section>

          {/* Bottom Row - Map, Quality Gauge, Event Log */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <MapPanel lat={currentData.lat} lng={currentData.lng} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.45s' }}>
              <WaterQualityGauge tds={currentData.tds} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <EventLog />
            </div>
          </section>
        </main>

        {/* Footer */}
        <StatusFooter
          batteryPct={currentData.batteryPct}
          signalRssi={currentData.signalRssi}
          lastSync={lastUpdated}
        />
      </div>
    </div>
  );
};

export default Index;
