"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

import { apiFetch, ApiError } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FlaskConical, Code } from "lucide-react";

const mlTestSchema = z.object({
  body: z.string().min(10, "Post body must be at least 10 characters"),
  platform: z.enum(["linkedin", "twitter", "instagram", "facebook"]),
  content_type: z.enum(["text", "image", "video", "carousel"]),
});

type MlTestValues = z.infer<typeof mlTestSchema>;

export default function MlTestPage() {
  const [response, setResponse] = React.useState<any>(null);

  const form = useForm<MlTestValues>({
    resolver: zodResolver(mlTestSchema),
    defaultValues: {
      body: "We are thrilled to announce our new product launch! Stay tuned for more updates. #launch #tech",
      platform: "linkedin",
      content_type: "text",
    },
  });

  const predictMutation = useMutation({
    mutationFn: (data: MlTestValues) => 
      apiFetch("/content/predict-engagement", {
        method: "POST",
        body: JSON.stringify({
          body: data.body,
          platform: data.platform,
          content_type: data.content_type,
          scheduledFor: new Date().toISOString() // Just dummy date for ML
        }),
      }),
    onSuccess: (data) => {
      setResponse(data);
      toast.success("RPC successful! Prediction received.");
    },
    onError: (err: ApiError) => {
      toast.error(err.message);
      setResponse({ error: err.message });
    },
  });

  function onSubmit(data: MlTestValues) {
    predictMutation.mutate(data);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ML RPC Sandbox</h1>
        <p className="text-zinc-500">Test the Python FastAPI worker directly without persisting to the database.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-blue-600" />
              Engagement Predictor
            </CardTitle>
            <CardDescription>
              Submit a raw text body to the prediction pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform</label>
                <select 
                  {...form.register("platform")}
                  className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                >
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content Type</label>
                <select 
                  {...form.register("content_type")}
                  className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                >
                  <option value="text">Text Only</option>
                  <option value="image">Image Post</option>
                  <option value="video">Video Post</option>
                  <option value="carousel">Carousel</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Post Body</label>
                <textarea 
                  {...form.register("body")}
                  rows={6}
                  className="flex w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 resize-none"
                  placeholder="Type your post content here..."
                />
                {form.formState.errors.body && (
                  <p className="text-[0.8rem] text-red-500">{form.formState.errors.body.message}</p>
                )}
              </div>

              <Button type="submit" disabled={predictMutation.isPending} className="w-full">
                {predictMutation.isPending ? <Spinner size={16} className="mr-2" /> : null}
                Run Prediction via RPC
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 text-zinc-50 border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              <Code className="h-5 w-5" />
              RPC Response
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Raw JSON output from the Python Worker.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {predictMutation.isPending ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4 text-zinc-400">
                <Spinner />
                <p className="text-sm animate-pulse">Awaiting RPC response from Redis Pub/Sub...</p>
              </div>
            ) : response ? (
              <pre className="text-xs font-mono bg-zinc-900 p-4 rounded-md overflow-x-auto text-green-400 max-h-[400px] overflow-y-auto border border-zinc-800">
                {JSON.stringify(response, null, 2)}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-zinc-500">
                <p className="text-sm">Submit a prediction to see the output here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
