"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Zap, Cpu, ArrowUpRight } from "lucide-react";

export default function SettingsPage() {
  const { data: usageData, isLoading } = useQuery({
    queryKey: ["org-usage"],
    queryFn: () => apiFetch<any>("/orgs/usage"),
  });

  if (isLoading) return <div className="flex justify-center p-12"><Spinner /></div>;
  if (!usageData) return <div>Failed to load usage data.</div>;

  const { subscription, aiUsage } = usageData;
  
  // Calculate tokens usage percentage (assuming 100,000 token limit for FREE tier, 1,000,000 for PRO)
  const tokenLimit = subscription.plan === "PRO" ? 1000000 : 100000;
  const tokensUsed = aiUsage.totalTokens || 0;
  const usagePercentage = Math.min((tokensUsed / tokenLimit) * 100, 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings & Billing</h1>
        <p className="text-zinc-500">Manage your subscription plan and monitor AI usage.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Subscription Plan Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Current Plan
              </CardTitle>
              <Badge variant={subscription.plan === "PRO" ? "default" : "secondary"}>
                {subscription.plan}
              </Badge>
            </div>
            <CardDescription>
              You are currently on the {subscription.plan} plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end space-y-4">
            <div className="bg-zinc-50 p-4 rounded-md border text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Status</span>
                <span className="font-medium text-green-600">{subscription.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Billing Cycle</span>
                <span className="font-medium">Monthly</span>
              </div>
              {subscription.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Renews On</span>
                  <span className="font-medium">{new Date(subscription.expiresAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            {subscription.plan === "FREE" && (
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Zap className="mr-2 h-4 w-4" />
                Upgrade to PRO
              </Button>
            )}
          </CardContent>
        </Card>

        {/* AI Usage Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-purple-600" />
              AI Token Usage
            </CardTitle>
            <CardDescription>
              Monitor your AI generation consumption for this billing cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tokens Used</span>
                <span className="text-sm text-zinc-500">{tokensUsed.toLocaleString()} / {tokenLimit.toLocaleString()}</span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${usagePercentage > 90 ? 'bg-red-500' : 'bg-purple-600'}`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              {usagePercentage > 90 && (
                <p className="text-xs text-red-500 mt-2">You are approaching your token limit!</p>
              )}
            </div>

            <div className="bg-purple-50 p-4 rounded-md border border-purple-100 space-y-1">
              <p className="text-xs text-purple-600 font-semibold uppercase">Estimated API Cost Incurred</p>
              <p className="text-2xl font-black text-purple-900">${aiUsage.totalCost.toFixed(4)}</p>
              <p className="text-xs text-purple-700">Cost is calculated based on exact LLM usage.</p>
            </div>
            
            <Button variant="outline" className="w-full">
              View Detailed Logs
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
