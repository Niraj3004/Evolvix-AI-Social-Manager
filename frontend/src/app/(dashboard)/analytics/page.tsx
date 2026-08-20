"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Users, Eye, ThumbsUp, MessageSquare, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics Overview</h1>
        <p className="text-zinc-500">Track the performance of your AI-generated content.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Reach", value: "0", icon: Users, change: "+0%" },
          { title: "Impressions", value: "0", icon: Eye, change: "+0%" },
          { title: "Engagement", value: "0", icon: ThumbsUp, change: "+0%" },
          { title: "Comments", value: "0", icon: MessageSquare, change: "+0%" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-zinc-500">{stat.title}</p>
                <stat.icon className="h-4 w-4 text-zinc-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold">{stat.value}</h2>
                <span className="text-xs font-medium text-emerald-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Engagement Over Time</CardTitle>
            <CardDescription>Daily engagement metrics across all connected platforms.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px] text-zinc-400 text-sm border border-dashed rounded-md m-6">
            Chart data unavailable
          </CardContent>
        </Card>
        
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>Posts with the highest engagement rates.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-sm text-zinc-500">
              Not enough data to display top content.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
