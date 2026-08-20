"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuthStore } from "@/store/auth.store";
import { apiFetch, ApiError } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const orgSchema = z.object({
  name: z.string().min(2, { message: "Organization name is required" }),
});

type OrgFormValues = z.infer<typeof orgSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<OrgFormValues>({
    resolver: zodResolver(orgSchema),
    defaultValues: { name: "" },
  });

  async function onSubmit(data: OrgFormValues) {
    setIsLoading(true);
    try {
      // 1. Create Organization
      await apiFetch("/orgs", {
        method: "POST",
        body: JSON.stringify(data),
      });

      // 2. Force token refresh to get new token WITH orgId payload
      const state = useAuthStore.getState();
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });

      if (!refreshResponse.ok) throw new Error("Failed to refresh session");

      const refreshData = await refreshResponse.json();
      if (refreshData.success && refreshData.data?.accessToken) {
        state.setTokens(refreshData.data.accessToken);
        
        // Also fetch the `/auth/me` to update the user in the Zustand store with the new orgId
        const meData = await apiFetch<any>("/auth/me");
        state.login(meData, refreshData.data.accessToken, state.refreshToken!);

        toast.success("Organization created!");
        router.push("/");
      }
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Failed to create organization");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Welcome to Evolvix AI</CardTitle>
          <p className="text-sm text-zinc-500">Let's set up your organization to get started.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Organization Name</label>
              <Input placeholder="Acme Corp" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-[0.8rem] font-medium text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner size={16} className="mr-2" /> : null}
              Create Organization
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
