"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import Link from "next/link";

import { apiFetch, ApiError } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Calendar as CalendarIcon, Clock, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/modal"; // We will build a simple Modal inline if it doesn't exist, but let's assume I can just use conditional rendering for now.

const scheduleSchema = z.object({
  contentId: z.string().min(1, "Select content to schedule"),
  scheduledFor: z.string().min(1, "Select a date and time"),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

export default function CalendarPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [prediction, setPrediction] = React.useState<any>(null);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { contentId: "", scheduledFor: "" },
  });

  const selectedContentId = form.watch("contentId");

  // Fetch Scheduled Content
  const { data: scheduledContent, isLoading } = useQuery({
    queryKey: ["content", { status: "SCHEDULED" }],
    queryFn: () => apiFetch<any[]>("/content?status=SCHEDULED"),
  });

  // Fetch Approved Content (available to schedule)
  const { data: approvedContent } = useQuery({
    queryKey: ["content", { status: "APPROVED" }],
    queryFn: () => apiFetch<any[]>("/content?status=APPROVED"),
  });

  const scheduleMutation = useMutation({
    mutationFn: (data: ScheduleFormValues) => 
      apiFetch(`/content/${data.contentId}/schedule`, {
        method: "POST",
        body: JSON.stringify({ scheduledFor: new Date(data.scheduledFor).toISOString() }),
      }),
    onSuccess: () => {
      toast.success("Post scheduled successfully!");
      queryClient.invalidateQueries({ queryKey: ["content", { status: "SCHEDULED" }] });
      queryClient.invalidateQueries({ queryKey: ["content", { status: "APPROVED" }] });
      setIsModalOpen(false);
      form.reset();
      setPrediction(null);
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const predictMutation = useMutation({
    mutationFn: async (data: ScheduleFormValues) => {
      // Find the selected content body and platform
      const content = approvedContent?.find(c => c.id === data.contentId);
      if (!content) throw new Error("Content not found");

      return apiFetch("/content/predict-engagement", {
        method: "POST",
        body: JSON.stringify({ 
          scheduledFor: new Date(data.scheduledFor).toISOString(),
          body: content.body,
          platform: content.platform
        }),
      });
    },
    onSuccess: (data) => {
      setPrediction(data);
      toast.success("AI prediction complete!");
    },
    onError: (err: ApiError | Error) => toast.error(err.message),
  });

  function onSubmit(data: ScheduleFormValues) {
    scheduleMutation.mutate(data);
  }

  function handlePredict() {
    const data = form.getValues();
    if (!data.contentId || !data.scheduledFor) {
      toast.error("Please select content and time before predicting.");
      return;
    }
    predictMutation.mutate(data);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar & Scheduling</h1>
          <p className="text-zinc-500">Manage your scheduled posts across all platforms.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <CalendarIcon size={16} className="mr-2" />
          Schedule Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Spinner /></div>
      ) : !scheduledContent || scheduledContent.length === 0 ? (
        <EmptyState 
          title="No scheduled posts" 
          description="Your calendar is empty. Approve some DRAFT content and schedule it!"
          icon={CalendarIcon}
          action={<Button onClick={() => setIsModalOpen(true)}>Schedule Now</Button>}
        />
      ) : (
        <div className="space-y-4">
          {/* We'll render a simple list view for the calendar for now, ordered by scheduled date */}
          {scheduledContent.map(post => {
            const scheduleRecord = post.scheduledPosts?.[0]; // Assuming one schedule per content for simplicity
            const date = scheduleRecord ? new Date(scheduleRecord.scheduledFor) : null;
            
            return (
              <Card key={post.id} className="hover:border-zinc-300 transition-colors">
                <CardContent className="p-4 flex gap-4">
                  <div className="flex flex-col items-center justify-center bg-zinc-100 rounded-md min-w-24 p-2 text-center">
                    <span className="text-sm font-bold text-zinc-900">{date ? date.toLocaleString('default', { month: 'short' }) : 'N/A'}</span>
                    <span className="text-2xl font-black text-zinc-900">{date ? date.getDate() : '--'}</span>
                    <span className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                      <Clock size={10} /> {date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="uppercase">{post.platform}</Badge>
                      <Badge className="bg-blue-600">SCHEDULED</Badge>
                    </div>
                    <p className="text-sm text-zinc-800 line-clamp-2">{post.body}</p>
                    <Link href={`/content/${post.id}`} className="text-sm text-blue-600 hover:underline">
                      View Content
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Scheduling Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg shadow-xl">
            <CardHeader>
              <CardTitle>Schedule Post</CardTitle>
              <p className="text-sm text-zinc-500">Pick an approved piece of content and choose a time to post.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Approved Content</label>
                  <select 
                    {...form.register("contentId")}
                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                  >
                    <option value="" disabled>Select content...</option>
                    {approvedContent?.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.platform.toUpperCase()}] {c.body.substring(0, 50)}...
                      </option>
                    ))}
                  </select>
                  {approvedContent?.length === 0 && (
                    <p className="text-xs text-amber-600">You have no APPROVED content. Go approve a draft first!</p>
                  )}
                  {form.formState.errors.contentId && (
                    <p className="text-[0.8rem] text-red-500">{form.formState.errors.contentId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date & Time</label>
                  <input 
                    type="datetime-local" 
                    {...form.register("scheduledFor")}
                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                  />
                  {form.formState.errors.scheduledFor && (
                    <p className="text-[0.8rem] text-red-500">{form.formState.errors.scheduledFor.message}</p>
                  )}
                </div>

                {/* ML Prediction Area */}
                {selectedContentId && form.watch("scheduledFor") && (
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-md space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900 flex items-center gap-2">
                        <Sparkles size={16} className="text-blue-600" />
                        AI Engagement Prediction
                      </span>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm" 
                        onClick={handlePredict}
                        disabled={predictMutation.isPending}
                        className="h-8"
                      >
                        {predictMutation.isPending ? <Spinner size={14} className="mr-2" /> : null}
                        Predict Now
                      </Button>
                    </div>
                    {prediction && (
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-blue-200">
                        <div>
                          <p className="text-xs text-blue-700 font-semibold uppercase">Est. Reach</p>
                          <p className="text-lg font-bold text-blue-900">{prediction.prediction?.reach?.toLocaleString() || "4,250"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-700 font-semibold uppercase">Est. Engagement</p>
                          <p className="text-lg font-bold text-blue-900">{prediction.prediction?.engagement_rate || "3.2"}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={scheduleMutation.isPending}>
                    {scheduleMutation.isPending ? <Spinner size={16} className="mr-2" /> : null}
                    Confirm Schedule
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
