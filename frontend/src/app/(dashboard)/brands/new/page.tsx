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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const brandSchema = z.object({
  name: z.string().min(2, "Brand name is required"),
  industry: z.string().min(2, "Industry is required"),
  description: z.string().min(10, "Provide a short description of what the brand does"),
  tone: z.string().optional(),
  language: z.string().optional(),
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
      tone: "Professional",
      language: "en",
    },
  });

  async function onSubmit(data: BrandFormValues) {
    setIsLoading(true);
    try {
      const response = await apiFetch<any>("/brands", {
        method: "POST",
        body: JSON.stringify(data),
      });

      toast.success("Brand created successfully!");
      router.push(`/brands/${response.id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create brand");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/brands">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Brand</h1>
          <p className="text-zinc-500">Define the core identity for AI content generation.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Profile</CardTitle>
          <CardDescription>
            The more details you provide, the better the AI will understand your brand voice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand Name</label>
                <Input placeholder="E.g., Evolvix AI" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <Input placeholder="E.g., SaaS, Retail, Healthcare" {...form.register("industry")} />
                {form.formState.errors.industry && (
                  <p className="text-xs text-red-500">{form.formState.errors.industry.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="What does your company do? Who are your customers?" 
                rows={4}
                {...form.register("description")} 
              />
              {form.formState.errors.description && (
                <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tone of Voice</label>
                <select 
                  {...form.register("tone")}
                  className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                >
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Humorous">Humorous</option>
                  <option value="Inspirational">Inspirational</option>
                  <option value="Authoritative">Authoritative</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Language</label>
                <select 
                  {...form.register("language")}
                  className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                >
                  <option value="en">English (US)</option>
                  <option value="en-gb">English (UK)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-zinc-100 pt-6">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner size={16} className="mr-2" /> : null}
                Create Brand
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
