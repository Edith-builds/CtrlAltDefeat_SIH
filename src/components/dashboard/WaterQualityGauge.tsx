import { getPollutionLevel, PollutionLevel } from '@/types/sensor';
import { cn } from '@/lib/utils';

interface WaterQualityGaugeProps {
  tds: number;
}

const pollutionConfig: Record<PollutionLevel, { 
  label: string; 
  color: string; 
  bgColor: string;
  description: string;
}> = {
  good: {
    label: 'Clean',
    color: 'text-status-safe',
    bgColor: 'bg-status-safe',
    description: 'Excellent water quality',
  },
  fair: {
    label: 'Moderate',
    color: 'text-status-warning',
    bgColor: 'bg-status-warning',
    description: 'Acceptable water quality',
  },
  poor: {
    label: 'Polluted',
    color: 'text-status-danger',
    bgColor: 'bg-status-danger',
    description: 'Poor water quality',
  },
};

export const WaterQualityGauge = ({ tds }: WaterQualityGaugeProps) => {
  const level = getPollutionLevel(tds);
  const config = pollutionConfig[level];
  
  // Calculate gauge position (0-900 ppm range)
  const percentage = Math.min((tds / 900) * 100, 100);
  const rotation = (percentage / 100) * 180 - 90;

  return (
    <div className="sensor-card bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Water Quality Index
        </h3>
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-semibold',
          config.bgColor + '/20',
          config.color
        )}>
          {config.label}
        </span>
      </div>

      {/* Gauge */}
      <div className="relative flex justify-center mb-4">
        <div className="relative w-40 h-20 overflow-hidden">
          {/* Background arc */}
          <div className="absolute bottom-0 left-0 right-0 h-40 rounded-t-full border-[12px] border-muted" 
               style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }} />
          
          {/* Colored segments */}
          <div className="absolute bottom-0 left-0 right-0 h-40">
            <div className="absolute bottom-0 left-0 right-0 h-40 rounded-t-full border-[12px] border-transparent"
                 style={{
                   borderTopColor: 'hsl(var(--status-safe))',
                   borderLeftColor: 'hsl(var(--status-safe))',
                   transform: 'rotate(-90deg)',
                   clipPath: 'polygon(0 0, 33% 0, 33% 100%, 0 100%)',
                 }} />
          </div>

          {/* Needle */}
          <div 
            className="absolute bottom-0 left-1/2 h-16 w-1 bg-foreground rounded-full origin-bottom transition-transform duration-700"
            style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
          />
          
          {/* Center dot */}
          <div className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full bg-foreground -translate-x-1/2 translate-y-1/2" />
        </div>
      </div>

      {/* Value display */}
      <div className="text-center">
        <span className="text-3xl font-bold font-mono text-foreground">{tds}</span>
        <span className="text-lg text-muted-foreground ml-1">ppm</span>
        <p className={cn('text-sm mt-1', config.color)}>{config.description}</p>
      </div>

      {/* Scale labels */}
      <div className="flex justify-between mt-4 text-xs text-muted-foreground">
        <span>0</span>
        <span className="text-status-safe">300</span>
        <span className="text-status-warning">600</span>
        <span className="text-status-danger">900+</span>
      </div>
    </div>
  );
};
