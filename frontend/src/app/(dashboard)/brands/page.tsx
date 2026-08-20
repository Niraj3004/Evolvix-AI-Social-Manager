"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Briefcase, ChevronRight } from "lucide-react";

export default function BrandsHubPage() {
  const { data: brands, isLoading, error } = useQuery({
    queryKey: ["brands"],
    queryFn: () => apiFetch<any[]>("/brands"),
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-red-500">
        <p>Error loading brands: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brand Hub</h1>
          <p className="text-zinc-500">Manage your brands, social accounts, and AI parameters.</p>
        </div>
        <Button asChild>
          <Link href="/brands/new">
            <Plus className="mr-2 h-4 w-4" />
            New Brand
          </Link>
        </Button>
      </div>

      {!brands || brands.length === 0 ? (
        <Card className="border-dashed bg-zinc-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Briefcase className="h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-900">No brands found</h3>
            <p className="text-zinc-500 max-w-sm mt-1 mb-6">
              Get started by creating your first brand profile to generate tailored AI content.
            </p>
            <Button asChild>
              <Link href="/brands/new">Create First Brand</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Card key={brand.id} className="group hover:border-zinc-300 transition-all hover:shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">{brand.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {brand.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-600">
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="font-medium text-zinc-900">Industry</span>
                  <span>{brand.industry || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="font-medium text-zinc-900">Tone</span>
                  <span>{brand.tone || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 pb-2">
                  <span className="font-medium text-zinc-900">Language</span>
                  <span className="uppercase">{brand.language || "EN"}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full group-hover:bg-zinc-50" asChild>
                  <Link href={`/brands/${brand.id}`}>
                    Manage Brand <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
