"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

import { apiFetch, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { PenTool } from "lucide-react";

const generateSchema = z.object({
  brandId: z.string().min(1, "Please select a brand"),
  platform: z.string().min(1, "Please select a platform"),
  prompt: z.string().min(10, "Prompt must be at least 10 characters long"),
});

type GenerateFormValues = z.infer<typeof generateSchema>;

export default function ContentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: { brandId: "", platform: "twitter", prompt: "" },
  });

  // Fetch Brands for dropdown
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => apiFetch<any[]>("/brands"),
  });

  // Fetch all Content
  const { data: contents, isLoading: isLoadingContent } = useQuery({
    queryKey: ["contents"],
    queryFn: () => apiFetch<any[]>("/content"),
  });

  const generateMutation = useMutation({
    mutationFn: (data: GenerateFormValues) => 
      apiFetch<{ content: any; strategy: any; design: any }>("/content/generate", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      toast.success("Content generated successfully!");
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      form.reset({ ...form.getValues(), prompt: "" });
      router.push(`/content/${data.content.id}`);
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  function onSubmit(data: GenerateFormValues) {
    generateMutation.mutate(data);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Content Studio</h1>
        <p className="text-zinc-500">Generate new AI content or manage existing drafts.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Generator Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>AI Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand</label>
                  <select 
                    {...form.register("brandId")}
                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                  >
                    <option value="" disabled>Select a brand</option>
                    {brands?.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  {form.formState.errors.brandId && (
                    <p className="text-[0.8rem] text-red-500">{form.formState.errors.brandId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <select 
                    {...form.register("platform")}
                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                  >
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Topic / Prompt</label>
                  <Textarea 
                    placeholder="E.g., Write a promotional post for our new summer shoe collection..." 
                    rows={4}
                    {...form.register("prompt")} 
                  />
                  {form.formState.errors.prompt && (
                    <p className="text-[0.8rem] text-red-500">{form.formState.errors.prompt.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={generateMutation.isPending}>
                  {generateMutation.isPending ? <Spinner size={16} className="mr-2" /> : null}
                  {generateMutation.isPending ? "Generating..." : "Generate Content"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Content List */}
        <div className="lg:col-span-2">
          {isLoadingContent ? (
            <div className="flex justify-center p-12"><Spinner /></div>
          ) : !contents || contents.length === 0 ? (
            <EmptyState 
              title="No content yet" 
              description="Use the generator on the left to create your first piece of AI content."
              icon={PenTool}
            />
          ) : (
            <div className="space-y-4">
              {contents.map((item) => (
                <Link key={item.id} href={`/content/${item.id}`} className="block">
                  <Card className="hover:border-zinc-300 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={item.status === 'APPROVED' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                            {item.platform}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-800 line-clamp-2">{item.body}</p>
                        <p className="text-xs text-zinc-500 mt-2">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
