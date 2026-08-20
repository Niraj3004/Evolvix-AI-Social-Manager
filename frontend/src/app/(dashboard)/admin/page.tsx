"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Users, Activity, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";

export default function AdminPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => apiFetch<any[]>("/admin/users").catch(() => []),
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Organization Admin</h1>
        <p className="text-zinc-500">Manage your organization's members, billing, and global settings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage who has access to this organization.</CardDescription>
            </div>
            <Button size="sm">Invite Member</Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8"><Spinner /></div>
            ) : !users || users.length === 0 ? (
              <div className="text-center py-8 text-sm text-zinc-500 border border-dashed rounded-md">
                No other members found in your organization.
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-xs text-zinc-500 capitalize">{user.role?.toLowerCase() || 'Member'}</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-zinc-500">Current Plan</span>
                <span className="font-medium">Pro</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-zinc-500">AI Tokens Used</span>
                <span className="font-medium">12,450 / 50,000</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-zinc-500">Brands</span>
                <span className="font-medium">1 / 5</span>
              </div>
              <Button variant="outline" className="w-full mt-4">Manage Subscription</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
