import { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, Signal, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { getFloodStatus, getPollutionLevel } from '@/types/sensor';

interface LogEntry {
  id: string;
  time: string;
  event: string;
  value?: string;
  type: 'info' | 'warning' | 'alert' | 'system';
}

const typeConfig = {
  info: { icon: CheckCircle2, color: 'text-status-safe', badge: 'bg-status-safe/20 text-status-safe' },
  warning: { icon: AlertTriangle, color: 'text-status-warning', badge: 'bg-status-warning/20 text-status-warning' },
  alert: { icon: AlertTriangle, color: 'text-status-danger', badge: 'bg-status-danger/20 text-status-danger' },
  system: { icon: RefreshCw, color: 'text-primary', badge: 'bg-primary/20 text-primary' },
};

export const EventLog = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>('all');

  // Generate log entry from sensor reading
  const createLogFromReading = (reading: {
    id: number;
    water_level: number;
    temperature: number;
    tds: number;
    recorded_at: string;
    flood_status: string;
  }): LogEntry[] => {
    const entries: LogEntry[] = [];
    const time = new Date(reading.recorded_at).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const waterLevel = Number(reading.water_level);
    const floodStatus = getFloodStatus(waterLevel);
    const pollutionLevel = getPollutionLevel(reading.tds);

    // Water level entry
    let waterType: LogEntry['type'] = 'info';
    if (floodStatus === 'flood') waterType = 'alert';
    else if (floodStatus === 'warning') waterType = 'warning';

    entries.push({
      id: `${reading.id}-water`,
      time,
      event: floodStatus === 'flood' 
        ? 'FLOOD ALERT - Critical water level!' 
        : floodStatus === 'warning' 
        ? 'Warning: Water level approaching threshold'
        : 'Water level reading received',
      value: `${waterLevel} cm`,
      type: waterType,
    });

    // TDS entry if concerning
    if (pollutionLevel === 'poor') {
      entries.push({
        id: `${reading.id}-tds`,
        time,
        event: 'Poor water quality detected',
        value: `${reading.tds} ppm`,
        type: 'warning',
      });
    }

    return entries;
  };

  // Fetch initial logs from recent sensor readings
  useEffect(() => {
    const fetchInitialLogs = async () => {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('id, water_level, temperature, tds, recorded_at, flood_status')
        .order('recorded_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching logs:', error);
        return;
      }

      if (data && data.length > 0) {
        const allLogs: LogEntry[] = [];
        data.forEach((reading) => {
          const entries = createLogFromReading(reading);
          allLogs.push(...entries);
        });
        setLogs(allLogs);
      }
    };

    fetchInitialLogs();
  }, []);

  // Subscribe to new sensor readings
  useEffect(() => {
    const channel = supabase
      .channel('event-log-readings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings',
        },
        (payload) => {
          const reading = payload.new as {
            id: number;
            water_level: number;
            temperature: number;
            tds: number;
            recorded_at: string;
            flood_status: string;
          };
          
          const newEntries = createLogFromReading(reading);
          setLogs((prev) => [...newEntries, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.type === filter);

  return (
    <div className="chart-container h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Signal className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Event Log</h3>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1 flex-wrap">
            {['all', 'info', 'warning', 'alert', 'system'].map((type) => (
              <Button
                key={type}
                variant={filter === type ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(type)}
                className="text-xs capitalize h-7 px-2"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto pr-2 max-h-64">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No events to display</p>
            <p className="text-xs mt-1">Waiting for sensor data...</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const config = typeConfig[log.type];
            const Icon = config.icon;
            
            return (
              <div
                key={log.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
              >
                <Icon className={cn('h-4 w-4 flex-shrink-0', config.color)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{log.event}</p>
                  <p className="text-xs text-muted-foreground font-mono">{log.time}</p>
                </div>
                {log.value && (
                  <Badge variant="outline" className={cn('text-xs font-mono', config.badge)}>
                    {log.value}
                  </Badge>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
