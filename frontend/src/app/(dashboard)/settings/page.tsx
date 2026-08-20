"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [email, setEmail] = React.useState(user?.email || "");

  const handleSave = () => {
    toast.success("Settings saved successfully (Demo)");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-500">Manage your personal account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
              className="bg-zinc-50"
            />
            <p className="text-xs text-zinc-500">Email cannot be changed currently.</p>
          </div>
          
          <div className="space-y-2 pt-4">
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible account actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-zinc-500">Permanently delete your account and all data.</p>
            </div>
            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
