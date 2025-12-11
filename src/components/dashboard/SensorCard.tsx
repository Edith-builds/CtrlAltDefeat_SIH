import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  subtitle?: string;
  colorClass: string;
  bgClass: string;
  progress?: {
    value: number;
    max: number;
    colorClass: string;
  };
  trend?: 'up' | 'down' | 'stable';
  children?: React.ReactNode;
}

export const SensorCard = ({
  title,
  value,
  unit,
  icon: Icon,
  subtitle,
  colorClass,
  bgClass,
  progress,
  children,
}: SensorCardProps) => {
  return (
    <div className={cn('sensor-card bg-card h-full flex flex-col', bgClass)}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={cn('p-1.5 sm:p-2 rounded-lg', colorClass.replace('text-', 'bg-') + '/15')}>
          <Icon className={cn('h-4 w-4 sm:h-6 sm:w-6', colorClass)} />
        </div>
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      
      <div className="mb-2 flex-1">
        <span className="text-xl sm:text-3xl font-bold text-foreground font-mono">
          {value}
        </span>
        <span className="text-sm sm:text-lg text-muted-foreground ml-1">{unit}</span>
      </div>
      
      {subtitle && (
        <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{subtitle}</p>
      )}
      
      {progress && (
        <div className="mt-auto">
          <div className="h-1.5 sm:h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-700', progress.colorClass)}
              style={{ width: `${Math.min((progress.value / progress.max) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
};
