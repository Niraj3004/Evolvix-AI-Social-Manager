"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase } from "lucide-react";

export default function BrandsPage() {
  const { data: brands, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: () => apiFetch<any[]>("/brands"),
  });

  if (isLoading) {
    return <div className="flex justify-center p-12"><Spinner /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brands</h1>
          <p className="text-zinc-500">Manage your brand profiles and settings.</p>
        </div>
        <Button asChild>
          <Link href="/brands/new">Add Brand</Link>
        </Button>
      </div>

      {!brands || brands.length === 0 ? (
        <EmptyState 
          title="No brands found" 
          description="You haven't set up any brands in this organization yet."
          icon={Briefcase}
          action={<Button asChild><Link href="/brands/new">Create your first Brand</Link></Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brands.map(brand => (
            <Link key={brand.id} href={`/brands/${brand.id}`}>
              <Card className="hover:border-zinc-300 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle>{brand.name}</CardTitle>
                  <p className="text-sm text-zinc-500">{brand.industry || "No industry specified"}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-600 line-clamp-2">
                    {brand.description || "No description provided."}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
