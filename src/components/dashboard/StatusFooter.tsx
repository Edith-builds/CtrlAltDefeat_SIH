import { Battery, Signal, HardDrive, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusFooterProps {
  batteryPct?: number;
  signalRssi?: number;
  lastSync?: Date;
}

export const StatusFooter = ({ 
  batteryPct = 82, 
  signalRssi = -71,
  lastSync = new Date() 
}: StatusFooterProps) => {
  const signalStrength = Math.min(100, Math.max(0, 100 + signalRssi));
  
  const getBatteryColor = (pct: number) => {
    if (pct > 50) return 'text-status-safe';
    if (pct > 20) return 'text-status-warning';
    return 'text-status-danger';
  };

  const getSignalBars = (strength: number) => {
    const bars = Math.ceil(strength / 25);
    return Array.from({ length: 4 }, (_, i) => i < bars);
  };

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          {/* Battery */}
          <div className="flex items-center gap-2">
            <Battery className={cn('h-4 w-4', getBatteryColor(batteryPct))} />
            <span className="text-muted-foreground">Battery:</span>
            <span className={cn('font-medium', getBatteryColor(batteryPct))}>
              {batteryPct}%
            </span>
          </div>

          {/* Signal Strength */}
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-0.5 h-4">
              {getSignalBars(signalStrength).map((active, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1 rounded-t transition-all',
                    active ? 'bg-primary' : 'bg-muted',
                    i === 0 && 'h-1',
                    i === 1 && 'h-2',
                    i === 2 && 'h-3',
                    i === 3 && 'h-4',
                  )}
                />
              ))}
            </div>
            <span className="text-muted-foreground">GSM Signal:</span>
            <span className="font-medium text-foreground">{signalStrength}%</span>
          </div>

          {/* Storage */}
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-status-safe" />
            <span className="text-muted-foreground">Local Logging:</span>
            <span className="font-medium text-status-safe">Active</span>
          </div>

          {/* Last Sync */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Last Sync:</span>
            <span className="font-mono text-foreground">
              {lastSync.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
