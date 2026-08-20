"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { apiFetch, ApiError } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Users, CreditCard } from "lucide-react";

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<"users" | "payments">("payments");

  // Fetch Users
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => apiFetch<any[]>("/admin/users"),
    enabled: activeTab === "users",
    retry: false
  });

  // Fetch Payments
  const { data: payments, isLoading: isLoadingPayments, error: paymentsError } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => apiFetch<any[]>("/admin/payments"),
    enabled: activeTab === "payments",
    retry: false
  });

  // Approve Payment Mutation
  const approveMutation = useMutation({
    mutationFn: (paymentId: string) => 
      apiFetch(`/admin/payments/${paymentId}/approve`, {
        method: "POST",
      }),
    onSuccess: () => {
      toast.success("Payment approved! Subscription activated.");
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  // Since this is a super admin route, standard users will get a 403 Forbidden.
  if (usersError?.message?.includes("Forbidden") || paymentsError?.message?.includes("Forbidden")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <ShieldCheck className="h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold text-zinc-900">Access Denied</h1>
        <p className="text-zinc-500 max-w-md">You do not have the required SUPER admin privileges to view this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Super Admin Dashboard</h1>
        <p className="text-zinc-500">Manage global platform users and approve manual payments.</p>
      </div>

      <div className="flex border-b border-zinc-200">
        <button 
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === "payments" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
        >
          <CreditCard size={16} />
          Payments
        </button>
        <button 
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === "users" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
        >
          <Users size={16} />
          Users
        </button>
      </div>

      {activeTab === "payments" && (
        <Card>
          <CardHeader>
            <CardTitle>Manual Payments Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPayments ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : !payments || payments.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">No payments found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Organization</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-zinc-50">
                        <td className="px-4 py-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-medium">{p.organization?.name || p.orgId}</td>
                        <td className="px-4 py-3">{p.method}</td>
                        <td className="px-4 py-3">${p.amount}</td>
                        <td className="px-4 py-3">
                          <Badge variant={p.status === "APPROVED" ? "default" : p.status === "PENDING" ? "secondary" : "destructive"}>
                            {p.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          {p.screenshotUrl && (
                            <a href={`http://localhost:5000/${p.screenshotUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">
                              View Receipt
                            </a>
                          )}
                          {p.status === "PENDING" && (
                            <Button 
                              size="sm" 
                              onClick={() => approveMutation.mutate(p.id)}
                              disabled={approveMutation.isPending}
                            >
                              {approveMutation.isPending ? <Spinner size={14} className="mr-2" /> : null}
                              Approve
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "users" && (
        <Card>
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : !users || users.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b">
                    <tr>
                      <th className="px-4 py-3">Joined</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Organizations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b hover:bg-zinc-50">
                        <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-medium">{u.email}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {u.memberships?.map((m: any) => (
                              <Badge key={m.organization.id} variant="outline" className="text-[10px]">
                                {m.organization.name} ({m.role})
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
