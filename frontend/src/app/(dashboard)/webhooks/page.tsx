"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Webhook, Plus, Trash2, Power, PowerOff } from "lucide-react";
import toast from "react-hot-toast";

// Mock Data
type WebhookItem = {
  id: string;
  url: string;
  events: string[];
  status: "active" | "inactive";
  createdAt: string;
};

const initialWebhooks: WebhookItem[] = [
  {
    id: "wh_12345",
    url: "https://api.mycompany.com/webhooks/evolvix",
    events: ["content.published", "payment.failed"],
    status: "active",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = React.useState<WebhookItem[]>(initialWebhooks);
  const [newUrl, setNewUrl] = React.useState("");

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return toast.error("URL is required");
    if (!newUrl.startsWith("http")) return toast.error("URL must start with http or https");

    const newWebhook: WebhookItem = {
      id: `wh_${Math.floor(Math.random() * 10000)}`,
      url: newUrl,
      events: ["content.created", "content.published"],
      status: "active",
      createdAt: new Date().toISOString(),
    };

    setWebhooks([newWebhook, ...webhooks]);
    setNewUrl("");
    toast.success("Webhook endpoint registered successfully! (Mocked)");
  };

  const toggleStatus = (id: string) => {
    setWebhooks(webhooks.map(wh => {
      if (wh.id === id) {
        const newStatus = wh.status === "active" ? "inactive" : "active";
        toast.success(`Webhook ${newStatus}`);
        return { ...wh, status: newStatus };
      }
      return wh;
    }));
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(wh => wh.id !== id));
    toast.success("Webhook deleted");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Webhooks (Developer Preview)</h1>
        <p className="text-zinc-500">Register endpoints to receive real-time HTTP POST payloads when events occur in your organization.</p>
        <p className="text-xs text-amber-600 font-medium mt-1">Note: This is a frontend mock as outgoing webhooks are currently in development on the backend.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Register New Endpoint</CardTitle>
          <CardDescription>Enter the URL where you want to receive webhook payloads.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddWebhook} className="flex gap-4">
            <div className="flex-1">
              <input 
                type="url" 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://your-api.com/webhooks"
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
              />
            </div>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Add Endpoint
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Active Endpoints</h2>
        
        {webhooks.length === 0 ? (
          <div className="border border-dashed rounded-lg p-12 text-center text-zinc-500 flex flex-col items-center justify-center">
            <Webhook className="h-8 w-8 mb-4 text-zinc-300" />
            <p>No webhooks configured yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {webhooks.map((wh) => (
              <Card key={wh.id} className={wh.status === "inactive" ? "opacity-60 bg-zinc-50" : ""}>
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-zinc-900">{wh.url}</span>
                      <Badge variant={wh.status === "active" ? "default" : "secondary"}>
                        {wh.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                      <span>ID: <code className="bg-zinc-100 px-1 py-0.5 rounded">{wh.id}</code></span>
                      <span>•</span>
                      <span>Added {new Date(wh.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {wh.events.map(ev => (
                        <Badge key={ev} variant="outline" className="text-[10px] bg-zinc-50">
                          {ev}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleStatus(wh.id)}
                    >
                      {wh.status === "active" ? <PowerOff size={14} className="mr-2" /> : <Power size={14} className="mr-2" />}
                      {wh.status === "active" ? "Disable" : "Enable"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteWebhook(wh.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
