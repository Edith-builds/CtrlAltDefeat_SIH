import { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, Signal, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    // Generate initial logs
    const initialLogs: LogEntry[] = [
      { id: '1', time: '10:42:17', event: 'Water reading received', value: '4.32 m', type: 'info' },
      { id: '2', time: '10:40:00', event: 'Sensor ping successful', type: 'system' },
      { id: '3', time: '10:35:22', event: 'TDS reading updated', value: '632 ppm', type: 'info' },
      { id: '4', time: '10:30:00', event: 'GSM signal check', value: '72%', type: 'system' },
      { id: '5', time: '10:15:45', event: 'Warning threshold approached', value: '4.85 m', type: 'warning' },
      { id: '6', time: '09:55:10', event: 'GSM reconnect', type: 'system' },
    ];
    setLogs(initialLogs);

    // Add new logs periodically
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        event: Math.random() > 0.7 ? 'Water level reading' : 'Sensor data received',
        value: `${(150 + Math.random() * 100).toFixed(2)} cm`,
        type: 'info',
      };
      setLogs(prev => [newLog, ...prev].slice(0, 20));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.type === filter);

  return (
    <div className="chart-container h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Signal className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Event Log</h3>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
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

      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {filteredLogs.map((log) => {
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
        })}
      </div>
    </div>
  );
};
