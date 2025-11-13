'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const messagesData = [
  { date: 'Jan', whatsApp: 200, telegram: 150, widget: 100, facebook: 50 },
  { date: 'Feb', whatsApp: 250, telegram: 180, widget: 120, facebook: 60 },
  { date: 'Mar', whatsApp: 300, telegram: 220, widget: 150, facebook: 80 },
  { date: 'Apr', whatsApp: 280, telegram: 200, widget: 140, facebook: 70 },
  { date: 'May', whatsApp: 350, telegram: 250, widget: 180, facebook: 90 },
  { date: 'Jun', whatsApp: 400, telegram: 280, widget: 200, facebook: 100 },
];
const messagesChartConfig = {
  whatsApp: { label: 'WhatsApp', color: 'hsl(var(--chart-1))' },
  telegram: { label: 'Telegram', color: 'hsl(var(--chart-2))' },
  widget: { label: 'Widget', color: 'hsl(var(--chart-3))' },
  facebook: { label: 'Facebook', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

const responseTimeData = [
  { date: 'Mon', time: 2.5 },
  { date: 'Tue', time: 2.8 },
  { date: 'Wed', time: 2.2 },
  { date: 'Thu', time: 3.1 },
  { date: 'Fri', time: 2.9 },
  { date: 'Sat', time: 3.5 },
  { date: 'Sun', time: 3.2 },
];
const responseTimeChartConfig = {
  time: { label: 'Avg. Response Time (min)', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;


const satisfactionData = [
  { month: 'January', rating: 4.5 },
  { month: 'February', rating: 4.2 },
  { month: 'March', rating: 4.6 },
  { month: 'April', rating: 4.8 },
  { month: 'May', rating: 4.7 },
  { month: 'June', rating: 4.9 },
];
const satisfactionChartConfig = {
    rating: { label: 'Satisfaction (out of 5)', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Messages per Channel</CardTitle>
          <CardDescription>
            Total messages received across all channels this year.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={messagesChartConfig} className="h-64 w-full">
            <BarChart data={messagesData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="whatsApp" fill="var(--color-whatsApp)" radius={4} />
              <Bar dataKey="telegram" fill="var(--color-telegram)" radius={4} />
              <Bar dataKey="widget" fill="var(--color-widget)" radius={4} />
              <Bar dataKey="facebook" fill="var(--color-facebook)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Response Time</CardTitle>
          <CardDescription>
            Average time to first response this week (in minutes).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={responseTimeChartConfig} className="h-64 w-full">
            <LineChart data={responseTimeData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="time" stroke="var(--color-time)" strokeWidth={2} dot={true}/>
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
            <CardDescription>Customer satisfaction ratings over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={satisfactionChartConfig} className="h-64 w-full">
                <BarChart data={satisfactionData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis domain={[3.5, 5]} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="rating" fill="var(--color-rating)" radius={4} />
                </BarChart>
            </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
