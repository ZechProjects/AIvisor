import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface CryptoChartProps {
  data: Array<{ timestamp: number; price: number }>;
  title: string;
  color?: string;
}

export function CryptoChart({ data, title, color = "#10b981" }: CryptoChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(timestamp: number) => new Date(timestamp).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(timestamp: number) => new Date(timestamp).toLocaleString()}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              />
              <Line 
                type="monotone"
                dataKey="price"
                stroke={color}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 