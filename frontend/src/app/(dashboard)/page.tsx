import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, PenTool, LayoutTemplate, Activity, Sparkles, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/30 blur-[100px]"></div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center rounded-full border border-zinc-700/50 bg-zinc-800/50 px-3 py-1 text-sm text-zinc-300 backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
            AI Social Manager
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            Welcome to Evolvix
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Your centralized AI command center. Oversee your brands, generate hyper-targeted content, and track multi-channel growth on autopilot.
          </p>
          <div className="flex gap-4 pt-4">
            <Button className="bg-white text-zinc-900 hover:bg-zinc-100 shadow-lg" asChild>
              <Link href="/content">
                <PenTool className="mr-2 h-4 w-4" />
                Generate Content
              </Link>
            </Button>
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white" asChild>
              <Link href="/brands/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Brand
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Active Brands", value: "1", icon: LayoutTemplate, change: "+1 this week", color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Posts Scheduled", value: "0", icon: Calendar, change: "0 pending", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { title: "AI Generated", value: "3", icon: Sparkles, change: "+3 today", color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { title: "Engagement Rate", value: "0%", icon: TrendingUp, change: "Needs more data", color: "text-rose-500", bg: "bg-rose-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="group hover:border-zinc-300 transition-all duration-300 hover:shadow-md overflow-hidden relative">
            <div className={`absolute top-0 right-0 p-4 opacity-50 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-100 ${stat.color}`}>
              <stat.icon className="h-24 w-24 -mr-8 -mt-8 opacity-20" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-zinc-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tracking-tight text-zinc-900">{stat.value}</div>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Links */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-zinc-200/60">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-lg">Recent AI Activity</CardTitle>
            <CardDescription>Your latest generations and scheduled jobs.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              {[
                { type: "Content Generation", brand: "Acme Corp", time: "2 hours ago", status: "Completed" },
                { type: "Strategy Research", brand: "Evolvix", time: "5 hours ago", status: "Completed" },
                { type: "Post Publishing", brand: "Acme Corp", time: "Yesterday", status: "Failed" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-6 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
                      <Activity className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{activity.type}</p>
                      <p className="text-sm text-zinc-500">for {activity.brand}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${activity.status === 'Completed' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {activity.status}
                    </p>
                    <p className="text-xs text-zinc-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm border-zinc-200/60 bg-gradient-to-b from-white to-zinc-50/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Brand Guidelines", href: "/brands" },
                { name: "Content Calendar", href: "/calendar" },
                { name: "Performance Reports", href: "/analytics" },
              ].map((link, i) => (
                <Link key={i} href={link.href} className="group flex items-center justify-between p-3 rounded-lg border border-zinc-200 bg-white hover:border-indigo-200 hover:shadow-sm transition-all">
                  <span className="text-sm font-medium text-zinc-700 group-hover:text-indigo-600">{link.name}</span>
                  <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
