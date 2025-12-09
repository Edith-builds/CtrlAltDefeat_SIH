import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { HistoricalDataPoint } from '@/types/sensor';

interface TempTdsChartProps {
  data: HistoricalDataPoint[];
}

export const TempTdsChart = ({ data }: TempTdsChartProps) => {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Temperature & Water Quality
        </h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-chart-temp" />
            <span className="text-muted-foreground">Temp (°C)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-chart-tds" />
            <span className="text-muted-foreground">TDS (ppm)</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            stroke="hsl(var(--border))"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            stroke="hsl(var(--border))"
            tickLine={false}
            axisLine={false}
            domain={[15, 35]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            stroke="hsl(var(--border))"
            tickLine={false}
            axisLine={false}
            domain={[0, 800]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => (
              <span className="text-xs text-muted-foreground">{value}</span>
            )}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temp"
            stroke="hsl(var(--chart-temp))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2 }}
            name="Temperature (°C)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="tds"
            stroke="hsl(var(--chart-tds))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2 }}
            name="TDS (ppm)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
