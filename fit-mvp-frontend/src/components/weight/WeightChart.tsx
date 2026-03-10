import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WeightEntryResponse, WeightUnit } from '@fitness/api-client';

interface WeightChartProps {
  weightEntries: WeightEntryResponse[];
  unit: WeightUnit;
  showBodyFat?: boolean;
}

const WeightChart = ({ weightEntries, unit, showBodyFat = false }: WeightChartProps) => {
  if (weightEntries.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No weight data yet</p>
          <p className="text-sm">Log weight entries to see your trend</p>
        </div>
      </div>
    );
  }

  // Sort entries by date ascending for chart
  const sortedEntries = [...weightEntries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Transform data for chart
  const chartData = sortedEntries.map((entry) => {
    let displayWeight = entry.weight;
    if (unit === 'LB') {
      displayWeight = entry.weight / 0.45359237;
    }

    const dataPoint: any = {
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: new Date(entry.date).toISOString().split('T')[0],
      weight: parseFloat(displayWeight.toFixed(1)),
    };

    if (showBodyFat && entry.bodyFat !== undefined) {
      dataPoint.bodyFat = parseFloat(entry.bodyFat.toFixed(1));
    }

    return dataPoint;
  });

  const weightUnitLabel = unit === 'LB' ? 'lb' : 'kg';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
          label={{ 
            value: `Weight (${weightUnitLabel})`, 
            angle: -90, 
            position: 'insideLeft',
            offset: 10,
            style: { textAnchor: 'middle', fill: '#6b7280' }
          }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            fontSize: '14px'
          }}
          formatter={(value: number, name: string) => {
            if (name === 'weight') return [`${value} ${weightUnitLabel}`, 'Weight'];
            if (name === 'bodyFat') return [`${value}%`, 'Body Fat'];
            return [value, name];
          }}
          labelFormatter={(label) => {
            const entry = chartData.find(d => d.date === label);
            return entry ? `Date: ${entry.fullDate}` : label;
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#f97316"
          strokeWidth={2}
          dot={{ r: 4, fill: '#f97316' }}
          activeDot={{ r: 6, fill: '#ea580c' }}
          name={`Weight (${weightUnitLabel})`}
        />
        {showBodyFat && (
          <Line
            type="monotone"
            dataKey="bodyFat"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4, fill: '#3b82f6' }}
            activeDot={{ r: 6, fill: '#1d4ed8' }}
            name="Body Fat (%)"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeightChart;