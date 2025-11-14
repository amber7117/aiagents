'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getAnalyticsStats,
  getConversationVolume,
  getResponseTime,
  getSatisfactionRatings,
} from '@/lib/api';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [conversationVolume, setConversationVolume] = useState<any[]>([]);
  const [responseTime, setResponseTime] = useState<any[]>([]);
  const [satisfactionRatings, setSatisfactionRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [
        statsData,
        volumeData,
        responseTimeData,
        satisfactionData,
      ] = await Promise.all([
        getAnalyticsStats(),
        getConversationVolume(),
        getResponseTime(),
        getSatisfactionRatings(),
      ]);
      setStats(statsData);
      setConversationVolume(volumeData);
      setResponseTime(responseTimeData);
      setSatisfactionRatings(satisfactionData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Loading analytics data...</p>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Get insights into your customer interactions.
          </p>
        </div>
        <Select defaultValue="last-7-days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-24-hours">Last 24 hours</SelectItem>
            <SelectItem value="last-7-days">Last 7 days</SelectItem>
            <SelectItem value="last-30-days">Last 30 days</SelectItem>
            <SelectItem value="last-90-days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalConversations.value}</p>
            <p className="text-sm text-green-500">
              {stats.totalConversations.change} vs last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.avgResponseTime.value}</p>
            <p className="text-sm text-red-500">
              {stats.avgResponseTime.change} vs last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Satisfaction Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.satisfactionRate.value}</p>
            <p className="text-sm text-green-500">
              {stats.satisfactionRate.change} vs last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activeAgents.value}</p>
            <p className="text-sm text-muted-foreground">Online now</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversation Volume</CardTitle>
          <CardDescription>
            Conversations received over the last 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversationVolume}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="whatsapp" stackId="a" fill="#25D366" />
              <Bar dataKey="website" stackId="a" fill="#1E88E5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Average Response Time</CardTitle>
            <CardDescription>
              Average first response time over the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Satisfaction Ratings</CardTitle>
            <CardDescription>
              Customer satisfaction ratings over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={satisfactionRatings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="rating"
                  fill="#FFC107"
                  activeBar={<Rectangle fill="gold" stroke="purple" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
