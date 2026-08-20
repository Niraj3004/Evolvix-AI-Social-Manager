"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CalendarPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-zinc-500">View and manage your scheduled posts.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Post
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="min-h-[600px] flex items-center justify-center border-dashed">
            <div className="text-center text-zinc-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-zinc-300" />
              <h3 className="text-lg font-semibold text-zinc-900">Calendar view coming soon</h3>
              <p className="max-w-sm mt-1">
                A full drag-and-drop calendar interface will be available in the next update.
              </p>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
              <CardDescription>Posts scheduled for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-zinc-500 text-center py-4">
                No upcoming posts.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
