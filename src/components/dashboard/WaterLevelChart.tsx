import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { HistoricalDataPoint } from '@/types/sensor';

interface WaterLevelChartProps {
  data: HistoricalDataPoint[];
  warningThreshold?: number;
  dangerThreshold?: number;
}

export const WaterLevelChart = ({ 
  data, 
  warningThreshold = 180,
  dangerThreshold = 220 
}: WaterLevelChartProps) => {
  return (
    <div className="chart-container h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">
          Real-Time Water Level Trend
        </h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-chart-water" />
            <span className="text-muted-foreground">Level (cm)</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-water))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-water))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              stroke="hsl(var(--border))"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              stroke="hsl(var(--border))"
              tickLine={false}
              axisLine={false}
              domain={[0, 300]}
              width={35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              itemStyle={{ color: 'hsl(var(--chart-water))' }}
            />
            <ReferenceLine 
              y={warningThreshold} 
              stroke="hsl(var(--status-warning))" 
              strokeDasharray="5 5"
              label={{ value: 'Warning', fill: 'hsl(var(--status-warning))', fontSize: 10 }}
            />
            <ReferenceLine 
              y={dangerThreshold} 
              stroke="hsl(var(--status-danger))" 
              strokeDasharray="5 5"
              label={{ value: 'Flood', fill: 'hsl(var(--status-danger))', fontSize: 10 }}
            />
            <Line
              type="monotone"
              dataKey="level"
              stroke="hsl(var(--chart-water))"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
              fill="url(#waterGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 sm:gap-6 mt-4 pt-4 border-t border-border text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-status-danger" />
          <span className="text-muted-foreground">Flood: &gt;{dangerThreshold}cm</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-status-warning" />
          <span className="text-muted-foreground">Warning: {warningThreshold}-{dangerThreshold}cm</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-status-safe" />
          <span className="text-muted-foreground">Safe: &lt;{warningThreshold}cm</span>
        </div>
      </div>
    </div>
  );
};
