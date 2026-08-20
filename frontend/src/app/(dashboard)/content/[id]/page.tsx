"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Save, Edit3 } from "lucide-react";
import toast from "react-hot-toast";

import { apiFetch, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function ContentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const contentId = params.id as string;

  const [isEditing, setIsEditing] = React.useState(false);
  const [editedBody, setEditedBody] = React.useState("");

  const { data: content, isLoading, error } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => apiFetch<any>(`/content/${contentId}`),
  });

  React.useEffect(() => {
    if (content) {
      setEditedBody(content.body);
    }
  }, [content]);

  const updateMutation = useMutation({
    mutationFn: (newBody: string) => 
      apiFetch(`/content/${contentId}`, {
        method: "PATCH",
        body: JSON.stringify({ body: newBody }),
      }),
    onSuccess: () => {
      toast.success("Content updated successfully");
      queryClient.invalidateQueries({ queryKey: ["content", contentId] });
      setIsEditing(false);
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const approveMutation = useMutation({
    mutationFn: () => 
      apiFetch(`/content/${contentId}/approve`, {
        method: "POST",
      }),
    onSuccess: () => {
      toast.success("Content approved for publishing");
      queryClient.invalidateQueries({ queryKey: ["content", contentId] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Spinner size={32} /></div>;
  }

  if (error || !content) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <p className="text-red-500">Error loading content details.</p>
        <Button onClick={() => router.push("/content")} variant="outline">Back to Content</Button>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content.body);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/content">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Content Draft
              <Badge variant={content.status === 'APPROVED' ? 'default' : 'secondary'} className="ml-2">
                {content.status}
              </Badge>
            </h1>
            <p className="text-zinc-500 text-sm">
              Platform: <span className="font-medium uppercase">{content.platform}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          {content.status !== 'APPROVED' && (
            <Button size="sm" onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending}>
              {approveMutation.isPending ? <Spinner size={16} className="mr-2" /> : <Check className="h-4 w-4 mr-2" />}
              Approve
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Post Content</CardTitle>
          {!isEditing && content.status !== 'APPROVED' && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-zinc-500">Caption</h3>
            {isEditing ? (
              <div className="space-y-4">
                <Textarea 
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setEditedBody(content.body);
                    setIsEditing(false);
                  }}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => updateMutation.mutate(editedBody)} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? <Spinner size={16} className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap font-mono text-sm bg-zinc-50 p-4 rounded-md border border-zinc-100 min-h-[200px]">
                {content.body || "No text content generated."}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-zinc-500">Generated Media</h3>
            {content.generatedMedia && content.generatedMedia.length > 0 ? (
              <div className="border border-zinc-100 rounded-md overflow-hidden bg-zinc-50">
                <img 
                  src={content.generatedMedia[0].url} 
                  alt="Generated content" 
                  className="w-full h-auto object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] border border-dashed rounded-md bg-zinc-50 text-zinc-400 text-sm">
                No media generated for this post.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
