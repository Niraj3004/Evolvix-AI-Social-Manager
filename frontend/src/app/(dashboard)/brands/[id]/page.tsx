"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

export default function BrandDashboardPage() {
  const params = useParams();
  const brandId = params.id as string;
  const queryClient = useQueryClient();
  const [docContent, setDocContent] = React.useState("");

  // Fetch Brand Info
  const { data: brand, isLoading } = useQuery({
    queryKey: ["brand", brandId],
    queryFn: () => apiFetch<any>(`/brands/${brandId}`),
  });

  // Fetch connected social accounts
  const { data: accounts } = useQuery({
    queryKey: ["social-accounts", brandId],
    queryFn: () => apiFetch<any[]>(`/social/${brandId}`),
  });

  // Document Upload Mutation
  const addDocMutation = useMutation({
    mutationFn: (content: string) => apiFetch(`/brands/${brandId}/documents`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
    onSuccess: () => {
      toast.success("Document added to brand memory!");
      setDocContent("");
      queryClient.invalidateQueries({ queryKey: ["brand", brandId] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  // Asset Upload Mutation
  const addAssetMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("asset", file);
      
      const state = useAuthStore.getState();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/brands/${brandId}/assets`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${state.accessToken}` },
        body: formData, // No Content-Type header so browser sets multipart boundary automatically
      });
      if (!res.ok) throw new Error("Failed to upload asset");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Asset uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["brand", brandId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Connect Social Account (Mock flow for now, normally would redirect to OAuth)
  const connectSocialMutation = useMutation({
    mutationFn: (platform: string) => apiFetch(`/social/${platform}/connect`, {
      method: "POST",
      body: JSON.stringify({ brandId, accountId: "mock_account_123", accessToken: "mock_token" }),
    }),
    onSuccess: () => {
      toast.success("Social account connected!");
      queryClient.invalidateQueries({ queryKey: ["social-accounts", brandId] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  if (isLoading) return <div className="flex justify-center p-12"><Spinner /></div>;
  if (!brand) return <div>Brand not found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">{brand.name}</h1>
          <p className="text-zinc-500">{brand.industry} · {brand.tone}</p>
        </div>
        <Badge variant="outline">Org: {brand.orgId}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brand Memory (RAG)</CardTitle>
              <p className="text-sm text-zinc-500">Upload text guidelines for the AI to learn from.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Paste brand guidelines, writing samples, or rules here..."
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                rows={5}
              />
              <Button 
                onClick={() => addDocMutation.mutate(docContent)}
                disabled={!docContent.trim() || addDocMutation.isPending}
              >
                {addDocMutation.isPending ? <Spinner size={16} className="mr-2" /> : null}
                Add to Memory
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assets & Logos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) addAssetMutation.mutate(file);
                  }}
                  disabled={addAssetMutation.isPending}
                />
                {addAssetMutation.isPending && <Spinner size={20} />}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  onClick={() => connectSocialMutation.mutate("meta")}
                  disabled={connectSocialMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Connect Facebook
                </Button>
                <Button 
                  onClick={() => connectSocialMutation.mutate("instagram")}
                  disabled={connectSocialMutation.isPending}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Connect Instagram
                </Button>
              </div>

              {accounts && accounts.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-semibold mb-2">Connected Accounts</h4>
                  <ul className="space-y-2">
                    {accounts.map(acc => (
                      <li key={acc.id} className="flex items-center justify-between bg-zinc-50 p-2 rounded-md border">
                        <span className="capitalize font-medium">{acc.platform}</span>
                        <Badge variant="secondary">Connected</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
