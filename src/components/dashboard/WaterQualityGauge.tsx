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
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  // Tick marks for speedometer
  const tickMarks = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="sensor-card bg-card h-full flex flex-col">
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

      {/* Speedometer Gauge */}
      <div className="relative flex justify-center items-center flex-1 min-h-[160px]">
        <div className="relative w-48 h-24">
          {/* Outer arc background */}
          <svg
            viewBox="0 0 200 110"
            className="w-full h-full"
          >
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="16"
              strokeLinecap="round"
            />
            
            {/* Green zone (0-300 ppm = 0-33%) */}
            <path
              d="M 20 100 A 80 80 0 0 1 53.3 34.5"
              fill="none"
              stroke="hsl(var(--status-safe))"
              strokeWidth="16"
              strokeLinecap="round"
            />
            
            {/* Yellow zone (300-600 ppm = 33-66%) */}
            <path
              d="M 53.3 34.5 A 80 80 0 0 1 146.7 34.5"
              fill="none"
              stroke="hsl(var(--status-warning))"
              strokeWidth="16"
            />
            
            {/* Red zone (600-900 ppm = 66-100%) */}
            <path
              d="M 146.7 34.5 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="hsl(var(--status-danger))"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Tick marks */}
            {tickMarks.map((i) => {
              const angle = -180 + (i * 20);
              const rad = (angle * Math.PI) / 180;
              const innerR = 62;
              const outerR = 72;
              const x1 = 100 + innerR * Math.cos(rad);
              const y1 = 100 + innerR * Math.sin(rad);
              const x2 = 100 + outerR * Math.cos(rad);
              const y2 = 100 + outerR * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2"
                  opacity="0.5"
                />
              );
            })}

            {/* Needle */}
            <g
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: '100px 100px',
                transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Needle body */}
              <polygon
                points="100,30 95,100 105,100"
                fill="hsl(var(--foreground))"
              />
              {/* Needle shadow for depth */}
              <polygon
                points="100,35 97,100 100,100"
                fill="hsl(var(--foreground))"
                opacity="0.7"
              />
            </g>

            {/* Center cap */}
            <circle
              cx="100"
              cy="100"
              r="12"
              fill="hsl(var(--foreground))"
            />
            <circle
              cx="100"
              cy="100"
              r="8"
              fill="hsl(var(--muted))"
            />
          </svg>
        </div>
      </div>

      {/* Value display */}
      <div className="text-center mt-2">
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
