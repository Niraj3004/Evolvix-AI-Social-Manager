"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

import { apiFetch, ApiError } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Share2, Trash2, Edit3, Link as LinkIcon } from "lucide-react";

const brandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  industry: z.string().optional(),
  description: z.string().optional(),
  audience: z.string().optional(),
  tone: z.string().optional(),
  language: z.string(),
  goals: z.string().optional(),
});

type BrandFormValues = z.infer<typeof brandSchema>;

export default function BrandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const brandId = params.id as string;

  const [isEditing, setIsEditing] = React.useState(false);

  // Fetch Brand
  const { data: brand, isLoading: isLoadingBrand } = useQuery({
    queryKey: ["brand", brandId],
    queryFn: () => apiFetch<any>(`/brands/${brandId}`),
  });

  // Fetch Social Accounts
  const { data: socialAccounts, isLoading: isLoadingSocial } = useQuery({
    queryKey: ["social", brandId],
    queryFn: () => apiFetch<any[]>(`/social/${brandId}`),
  });

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    values: brand ? {
      name: brand.name,
      industry: brand.industry || "",
      description: brand.description || "",
      audience: brand.audience || "",
      tone: brand.tone || "",
      language: brand.language || "en",
      goals: brand.goals ? brand.goals.join(", ") : "",
    } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data: BrandFormValues) => 
      apiFetch(`/brands/${brandId}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...data,
          goals: data.goals ? data.goals.split(",").map(g => g.trim()) : []
        })
      }),
    onSuccess: () => {
      toast.success("Brand updated!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["brand", brandId] });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiFetch(`/brands/${brandId}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Brand deleted");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      router.push("/brands");
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const connectSocialMutation = useMutation({
    mutationFn: (platform: string) => 
      apiFetch(`/social/${platform}/connect`, {
        method: "POST",
        body: JSON.stringify({ brandId, authCode: "dummy_code_from_oauth" })
      }),
    onSuccess: (data: any) => {
      toast.success(`${data.message}`);
      queryClient.invalidateQueries({ queryKey: ["social", brandId] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  if (isLoadingBrand) return <div className="flex h-48 justify-center items-center"><Spinner /></div>;
  if (!brand) return <div className="text-center py-12 text-zinc-500">Brand not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{brand.name}</h1>
          <p className="text-zinc-500 text-sm">Brand Profile & Social Connections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit3 size={16} className="mr-2" />
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </Button>
          <Button className="bg-red-600 text-white hover:bg-red-700 shadow-sm" onClick={() => {
            if (confirm("Are you sure you want to delete this brand? All content will be lost.")) {
              deleteMutation.mutate();
            }
          }} disabled={deleteMutation.isPending}>
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand AI Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={form.handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input {...form.register("name")} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Industry</label>
                      <Input {...form.register("industry")} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea {...form.register("description")} rows={3} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Audience</label>
                      <Input {...form.register("audience")} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tone</label>
                      <Input {...form.register("tone")} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Language</label>
                      <Input {...form.register("language")} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Goals (comma separated)</label>
                      <Input {...form.register("goals")} />
                    </div>
                  </div>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? <Spinner size={16} className="mr-2"/> : null}
                    Save Changes
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-zinc-50 p-4 rounded-md border text-sm text-zinc-700">
                    <p className="font-semibold text-zinc-900 mb-1">Description</p>
                    <p>{brand.description || "None"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-zinc-500 block">Industry</span><span className="font-medium">{brand.industry || "None"}</span></div>
                    <div><span className="text-zinc-500 block">Tone</span><span className="font-medium">{brand.tone || "None"}</span></div>
                    <div><span className="text-zinc-500 block">Audience</span><span className="font-medium">{brand.audience || "None"}</span></div>
                    <div><span className="text-zinc-500 block">Language</span><span className="font-medium uppercase">{brand.language || "None"}</span></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 size={18} />
                Social Accounts
              </CardTitle>
              <CardDescription>Connect platforms to schedule posts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingSocial ? <Spinner /> : socialAccounts?.length === 0 ? (
                <p className="text-sm text-zinc-500 border-l-2 border-zinc-200 pl-3">No connected accounts.</p>
              ) : (
                <ul className="space-y-3">
                  {socialAccounts?.map(acc => (
                    <li key={acc.id} className="flex justify-between items-center text-sm border-b pb-2">
                      <div className="flex items-center gap-2 font-medium capitalize">
                        {acc.platform === 'linkedin' && <span className="text-blue-600 font-bold">in</span>}
                        {acc.platform === 'twitter' && <span className="text-sky-500 font-bold">𝕏</span>}
                        {acc.platform === 'instagram' && <span className="text-pink-600 font-bold">ig</span>}
                        {acc.platform === 'facebook' && <span className="text-blue-700 font-bold">f</span>}
                        {acc.platform}
                      </div>
                      <span className="text-zinc-500 text-xs bg-zinc-100 px-2 py-0.5 rounded">Connected</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-4 space-y-2 border-t">
                <p className="text-xs font-semibold text-zinc-500 uppercase">Simulate OAuth Connection</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => connectSocialMutation.mutate("linkedin")} disabled={connectSocialMutation.isPending}>
                    <span className="mr-2 text-blue-600 font-bold">in</span> LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => connectSocialMutation.mutate("twitter")} disabled={connectSocialMutation.isPending}>
                    <span className="mr-2 text-sky-500 font-bold">𝕏</span> Twitter
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => connectSocialMutation.mutate("instagram")} disabled={connectSocialMutation.isPending}>
                    <span className="mr-2 text-pink-600 font-bold">ig</span> Instagram
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => connectSocialMutation.mutate("facebook")} disabled={connectSocialMutation.isPending}>
                    <span className="mr-2 text-blue-700 font-bold">f</span> Facebook
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
