"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { apiFetch, ApiError } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

const brandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters").max(100),
  industry: z.string().optional(),
  description: z.string().optional(),
  audience: z.string().optional(),
  tone: z.string().optional(),
  language: z.string().default("en"),
  goals: z.string().optional(), // We'll convert this to an array on submit
});

type BrandFormValues = z.infer<typeof brandSchema>;

export default function NewBrandPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      industry: "",
      description: "",
      audience: "",
      tone: "",
      language: "en",
      goals: "",
    },
  });

  async function onSubmit(data: BrandFormValues) {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        goals: data.goals ? data.goals.split(",").map(g => g.trim()) : [],
      };

      const newBrand = await apiFetch<{ id: string }>("/brands", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Brand profile created!");
      router.push(`/brands/${newBrand.id}`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Failed to create brand");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create a Brand</h1>
          <p className="text-zinc-500">Set up the profile and AI parameters for a new brand.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/brands">Cancel</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Basic Info</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand Name *</label>
                  <Input placeholder="Acme Corp" {...form.register("name")} />
                  {form.formState.errors.name && (
                    <p className="text-[0.8rem] text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <Input placeholder="e.g. Technology, Retail" {...form.register("industry")} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  placeholder="What does your brand do? This helps the AI understand your core business." 
                  {...form.register("description")} 
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">AI Parameters</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Audience</label>
                  <Input placeholder="e.g. Gen Z, Tech Enthusiasts" {...form.register("audience")} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Voice & Tone</label>
                  <Input placeholder="e.g. Professional, Witty, Casual" {...form.register("tone")} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Input placeholder="e.g. en, es, fr" {...form.register("language")} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Goals</label>
                  <Input placeholder="e.g. Brand Awareness, Lead Gen (comma separated)" {...form.register("goals")} />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? <Spinner size={16} className="mr-2" /> : null}
              Create Brand Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
