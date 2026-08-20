"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Activity, BarChart3, Heart, MessageCircle, MousePointerClick, Share2, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const [selectedBrandId, setSelectedBrandId] = React.useState<string>("");

  // Fetch Brands to populate the selector
  const { data: brands, isLoading: isBrandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: () => apiFetch<any[]>("/brands"),
  });

  // Automatically select the first brand if none is selected
  React.useEffect(() => {
    if (brands && brands.length > 0 && !selectedBrandId) {
      setSelectedBrandId(brands[0].id);
    }
  }, [brands, selectedBrandId]);

  // Fetch Analytics for the selected brand
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["analytics", selectedBrandId],
    queryFn: () => apiFetch<any[]>(`/analytics/${selectedBrandId}`),
    enabled: !!selectedBrandId,
  });

  if (isBrandsLoading) return <div className="flex justify-center p-12"><Spinner /></div>;

  if (!brands || brands.length === 0) {
    return (
      <EmptyState 
        title="No brands found" 
        description="You need to create a brand before viewing analytics."
        icon={BarChart3}
      />
    );
  }

  // Aggregate metrics
  const totals = {
    reach: 0,
    impressions: 0,
    likes: 0,
    comments: 0,
  };

  // Group data by date for the chart
  const chartDataMap: Record<string, number> = {};

  if (analyticsData) {
    analyticsData.forEach(item => {
      totals.reach += item.reach || 0;
      totals.impressions += item.impressions || 0;
      totals.likes += item.likes || 0;
      totals.comments += item.comments || 0;

      // Format date for chart (e.g., "Aug 15")
      const dateStr = new Date(item.createdAt).toLocaleDateString('default', { month: 'short', day: 'numeric' });
      chartDataMap[dateStr] = (chartDataMap[dateStr] || 0) + (item.reach || 0);
    });
  }

  // Convert map to array for Recharts
  const chartData = Object.entries(chartDataMap).map(([date, reach]) => ({
    name: date,
    reach,
  }));

  // If there's no data, let's at least show a flat line or empty state
  const hasData = analyticsData && analyticsData.length > 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Post Analytics</h1>
          <p className="text-zinc-500">Track performance metrics across your scheduled content.</p>
        </div>
        
        <div className="w-full sm:w-64">
          <select 
            value={selectedBrandId}
            onChange={(e) => setSelectedBrandId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isAnalyticsLoading ? (
        <div className="flex justify-center p-12"><Spinner /></div>
      ) : !hasData ? (
        <EmptyState 
          title="No analytics data" 
          description="We haven't gathered any data for this brand yet. Wait for scheduled posts to be published!"
          icon={TrendingUp}
        />
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                <Activity className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totals.reach.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                <Activity className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totals.impressions.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                <Heart className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totals.likes.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
                <MessageCircle className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totals.comments.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Reach Over Time</CardTitle>
              <CardDescription>Total reach generated by your posts per day.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    fontSize={12} 
                    tickMargin={10} 
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    fontSize={12} 
                    tickFormatter={(value) => `${value}`} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f4f4f5'}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="reach" fill="#18181b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b">
                    <tr>
                      <th className="px-4 py-3">Platform</th>
                      <th className="px-4 py-3">Content Snippet</th>
                      <th className="px-4 py-3 text-right">Reach</th>
                      <th className="px-4 py-3 text-right">Likes</th>
                      <th className="px-4 py-3 text-right">Shares</th>
                      <th className="px-4 py-3 text-right">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.slice(0, 10).map((item) => (
                      <tr key={item.id} className="border-b hover:bg-zinc-50">
                        <td className="px-4 py-3 font-medium uppercase">{item.scheduledPost?.content?.platform || 'Unknown'}</td>
                        <td className="px-4 py-3 max-w-[300px] truncate">
                          {item.scheduledPost?.content?.body || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-right">{item.reach.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">{item.likes.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">{item.shares.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">{item.clicks.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </  >
      )}
    </div>
  );
}
