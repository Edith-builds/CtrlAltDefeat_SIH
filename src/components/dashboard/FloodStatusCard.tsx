import { AlertTriangle, CheckCircle, AlertCircle, Waves } from 'lucide-react';
import { FloodStatus } from '@/types/sensor';
import { cn } from '@/lib/utils';

interface FloodStatusCardProps {
  status: FloodStatus;
  waterLevel: number;
  thresholdWarning?: number;
  thresholdFlood?: number;
}

const statusConfig = {
  normal: {
    icon: CheckCircle,
    title: 'SAFE',
    message: 'Water levels are within safe parameters. No immediate action required.',
    cardClass: 'status-card-safe border-2',
    iconClass: 'text-status-safe',
    titleClass: 'text-status-safe',
  },
  warning: {
    icon: AlertCircle,
    title: 'WARNING',
    message: 'Water levels approaching danger threshold. Monitor closely and prepare evacuation routes.',
    cardClass: 'status-card-warning border-2',
    iconClass: 'text-status-warning',
    titleClass: 'text-status-warning',
  },
  flood: {
    icon: AlertTriangle,
    title: 'FLOOD ALERT',
    message: 'Critical water levels detected! Immediate action required. Initiate emergency protocols.',
    cardClass: 'status-card-danger border-2 animate-pulse',
    iconClass: 'text-status-danger',
    titleClass: 'text-status-danger',
  },
};

export const FloodStatusCard = ({ 
  status, 
  waterLevel,
  thresholdWarning = 180,
  thresholdFlood = 220,
}: FloodStatusCardProps) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className={cn('rounded-xl p-6 transition-all duration-500', config.cardClass)}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className={cn('p-3 rounded-xl bg-card/50', config.iconClass)}>
            <StatusIcon className="h-10 w-10" />
          </div>
          <div className="flex-1">
            <h2 className={cn('text-2xl font-bold mb-1', config.titleClass)}>
              {config.title}
            </h2>
            <p className="text-sm text-foreground/80">{config.message}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <Waves className={cn('h-6 w-6', config.iconClass)} />
              <span className={cn('text-4xl font-bold font-mono', config.titleClass)}>
                {waterLevel}
              </span>
              <span className="text-lg text-muted-foreground">cm</span>
            </div>
            <span className="text-sm text-muted-foreground">Current Level</span>
          </div>
          
          {/* Threshold indicators */}
          <div className="hidden lg:flex flex-col gap-1 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-status-danger" />
              <span className="text-muted-foreground">Flood: &gt;{thresholdFlood}cm</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-status-warning" />
              <span className="text-muted-foreground">Warning: {thresholdWarning}-{thresholdFlood}cm</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-status-safe" />
              <span className="text-muted-foreground">Safe: &lt;{thresholdWarning}cm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
