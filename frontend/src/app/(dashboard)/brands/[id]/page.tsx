"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Twitter, FileText } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

export default function BrandDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.id as string;

  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploaded, setIsUploaded] = React.useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 1500);
  };

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsUploaded(true);
    }, 1500);
  };

  const { data: brand, isLoading, error } = useQuery({
    queryKey: ["brand", brandId],
    queryFn: () => apiFetch<any>(`/brands/${brandId}`),
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <p className="text-red-500">Error loading brand details.</p>
        <Button onClick={() => router.push("/brands")} variant="outline">
          Back to Brands
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/brands">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {brand.name}
              <Badge variant="secondary" className="ml-2">{brand.industry}</Badge>
            </h1>
            <p className="text-zinc-500">Manage brand settings and view linked assets.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-zinc-900">Description</h4>
                <p className="text-sm text-zinc-600 mt-1">{brand.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">Tone of Voice</h4>
                  <p className="text-sm text-zinc-600 mt-1">{brand.tone || "Not set"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">Primary Language</h4>
                  <p className="text-sm text-zinc-600 mt-1 uppercase">{brand.language || "EN"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Social Accounts</CardTitle>
              <CardDescription>Accounts authorized to publish content on behalf of this brand.</CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="text-center py-8 text-sm text-zinc-500 border border-dashed rounded-md">
                  No social accounts connected yet.
                  <div className="mt-4">
                    <Button variant="outline" onClick={handleConnect} disabled={isConnecting}>
                      {isConnecting ? "Connecting..." : "Connect Account"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
                        <Twitter className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-zinc-900">Twitter (X)</p>
                        <p className="text-xs text-zinc-500">@evolvix_ai</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Connected</Badge>
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">Connect Another Account</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>Files and text used by AI to learn about your brand.</CardDescription>
            </CardHeader>
            <CardContent>
              {!isUploaded ? (
                <div className="text-center py-6 text-sm text-zinc-500 border border-dashed rounded-md">
                  No documents uploaded.
                  <div className="mt-4">
                    <Button variant="secondary" size="sm" onClick={handleUpload} disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Upload Data"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-md bg-zinc-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-zinc-500" />
                      <span className="text-sm font-medium text-zinc-700">brand_guidelines_2024.pdf</span>
                    </div>
                    <span className="text-xs text-zinc-500">1.2 MB</span>
                  </div>
                  <div className="text-center mt-4">
                    <Button variant="secondary" size="sm">Upload More</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
