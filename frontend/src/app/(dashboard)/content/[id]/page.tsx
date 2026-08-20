"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";

import { apiFetch, ApiError } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock } from "lucide-react";

export default function ContentEditorPage() {
  const params = useParams();
  const contentId = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [body, setBody] = React.useState("");

  // Fetch specific content and its versions
  const { data: content, isLoading } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => apiFetch<any>(`/content/${contentId}`),
  });

  // Sync initial body state when data loads
  React.useEffect(() => {
    if (content && !body) {
      setBody(content.body);
    }
  }, [content, body]);

  const updateMutation = useMutation({
    mutationFn: (newBody: string) => 
      apiFetch(`/content/${contentId}`, {
        method: "PATCH",
        body: JSON.stringify({ body: newBody }),
      }),
    onSuccess: () => {
      toast.success("Content saved!");
      queryClient.invalidateQueries({ queryKey: ["content", contentId] });
      queryClient.invalidateQueries({ queryKey: ["contents"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  if (isLoading) return <div className="flex justify-center p-12"><Spinner /></div>;
  if (!content) return <div>Content not found</div>;

  const isDraft = content.status === "DRAFT";
  const hasChanges = body !== content.body;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link href="/content"><ArrowLeft size={16} /></Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Content Editor</h1>
            <Badge variant={isDraft ? "secondary" : "default"}>{content.status}</Badge>
            <Badge variant="outline" className="uppercase">{content.platform}</Badge>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Created on {new Date(content.createdAt).toLocaleString()}
          </p>
        </div>
        
        <div className="ml-auto flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setBody(content.body)}
            disabled={!hasChanges || updateMutation.isPending}
          >
            Discard
          </Button>
          <Button 
            onClick={() => updateMutation.mutate(body)}
            disabled={!hasChanges || updateMutation.isPending}
          >
            {updateMutation.isPending ? <Spinner size={16} className="mr-2" /> : null}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Copy / Body</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[300px] font-sans text-base leading-relaxed p-4"
                disabled={!isDraft} // Only drafts should be editable
              />
              {!isDraft && (
                <p className="text-xs text-amber-600 mt-2">
                  This content is {content.status} and can no longer be edited.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock size={18} className="text-zinc-500" />
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {content.contentVersions && content.contentVersions.length > 0 ? (
                <div className="space-y-4">
                  {/* Sort versions descending by creation date */}
                  {[...content.contentVersions]
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((version: any, index: number) => (
                    <div key={version.id} className="border-l-2 border-zinc-200 pl-4 py-1 relative">
                      <div className="absolute w-2 h-2 rounded-full bg-zinc-300 -left-[5px] top-2" />
                      <p className="text-xs font-semibold text-zinc-900">
                        {index === 0 ? "Current Version" : `Version ${content.contentVersions.length - index}`}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(version.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-zinc-600 mt-1 line-clamp-2">
                        {version.body}
                      </p>
                      {index !== 0 && isDraft && (
                        <button 
                          onClick={() => setBody(version.body)}
                          className="text-xs text-blue-600 mt-1 hover:underline"
                        >
                          Restore this version
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No version history available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
