"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

import { apiFetch, ApiError } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Check, UploadCloud, Banknote, Smartphone } from "lucide-react";

const manualPaymentSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  screenshot: z.any()
    .refine((files) => files?.length == 1, "Payment screenshot is required.")
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

type ManualPaymentValues = z.infer<typeof manualPaymentSchema>;

export default function UpgradePage() {
  const [activeTab, setActiveTab] = React.useState<"manual" | "esewa" | "khalti">("manual");
  
  const form = useForm<ManualPaymentValues>({
    resolver: zodResolver(manualPaymentSchema),
    defaultValues: { amount: "99" }, // Default PRO plan cost
  });

  // Since we are uploading a file, we can't use our standard apiFetch JSON wrapper easily.
  // We need to use native fetch with FormData.
  const manualMutation = useMutation({
    mutationFn: async (data: ManualPaymentValues) => {
      const formData = new FormData();
      formData.append("amount", data.amount);
      formData.append("screenshot", data.screenshot[0]);

      // We still need the auth token
      const token = localStorage.getItem("auth-token");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/payments/manual`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to submit manual payment");
      return json;
    },
    onSuccess: () => {
      toast.success("Manual payment submitted! Awaiting admin approval.");
      form.reset();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const walletMutation = useMutation({
    mutationFn: (method: "esewa" | "khalti") => 
      apiFetch(`/payments/${method}`, {
        method: "POST",
        body: JSON.stringify({ amount: 99 }),
      }),
    onSuccess: (data: any) => {
      // The backend returns a paymentUrl and signature for eSewa/Khalti
      // In a real scenario, we would submit a hidden form to that URL.
      // For this "fake" requirement, we just show a toast and simulate success.
      toast.success(`${data.data?.method} payment initiated! (Simulation)`);
      console.log("Wallet Payment Response:", data);
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  function onSubmitManual(data: ManualPaymentValues) {
    manualMutation.mutate(data);
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Upgrade to PRO</h1>
        <p className="text-zinc-500 max-w-xl mx-auto">
          Unlock unlimited AI generation, premium analytics, and priority support. 
          Choose your preferred payment method below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Pricing Plan Details */}
        <Card className="border-blue-200 bg-blue-50/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-900">PRO Plan</CardTitle>
            <CardDescription className="text-blue-700">Everything you need to dominate social media.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-2 text-blue-900">
              <span className="text-4xl font-black">$99</span>
              <span className="text-sm font-medium">/ month</span>
            </div>
            
            <ul className="space-y-3">
              {[
                "1,000,000 AI Tokens included",
                "Advanced Engagement Predictions",
                "Unlimited Scheduled Posts",
                "Priority Email & Chat Support",
                "Advanced Custom Brand Voices"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-blue-800">
                  <div className="bg-blue-600 rounded-full p-1">
                    <Check size={12} className="text-white" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="shadow-lg border-zinc-200">
          <CardHeader className="border-b bg-zinc-50/50 pb-0 pt-0 px-0 rounded-t-xl overflow-hidden">
            <div className="flex w-full">
              <button 
                onClick={() => setActiveTab("manual")}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === "manual" ? "border-b-2 border-zinc-900 text-zinc-900 bg-white" : "text-zinc-500 hover:text-zinc-700"}`}
              >
                Manual Transfer
              </button>
              <button 
                onClick={() => setActiveTab("esewa")}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === "esewa" ? "border-b-2 border-green-600 text-green-700 bg-white" : "text-zinc-500 hover:text-zinc-700"}`}
              >
                eSewa
              </button>
              <button 
                onClick={() => setActiveTab("khalti")}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === "khalti" ? "border-b-2 border-purple-600 text-purple-700 bg-white" : "text-zinc-500 hover:text-zinc-700"}`}
              >
                Khalti
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {activeTab === "manual" && (
              <form onSubmit={form.handleSubmit(onSubmitManual)} className="space-y-4">
                <div className="bg-zinc-50 p-4 rounded-md border text-sm space-y-2 mb-4">
                  <p className="font-semibold text-zinc-900">Bank Details for Transfer:</p>
                  <p className="text-zinc-600">Bank: <span className="font-medium text-zinc-900">Global IME Bank</span></p>
                  <p className="text-zinc-600">Account Name: <span className="font-medium text-zinc-900">Evolvix AI Pvt Ltd</span></p>
                  <p className="text-zinc-600">Account Number: <span className="font-medium text-zinc-900">0123456789012345</span></p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Amount (USD)</label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input 
                      type="number"
                      readOnly
                      {...form.register("amount")}
                      className="flex h-10 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-10 px-3 py-2 text-sm shadow-sm font-medium text-zinc-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Payment Screenshot</label>
                  <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-50 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      {...form.register("screenshot")}
                    />
                    <UploadCloud className="h-8 w-8 text-zinc-400 mb-2" />
                    <p className="text-sm font-medium text-zinc-900">Click to upload or drag and drop</p>
                    <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    {form.watch("screenshot")?.[0] && (
                      <div className="mt-4 p-2 bg-green-50 text-green-700 text-xs rounded-md border border-green-200 w-full font-medium truncate">
                        Selected: {form.watch("screenshot")[0].name}
                      </div>
                    )}
                  </div>
                  {form.formState.errors.screenshot && (
                    <p className="text-[0.8rem] text-red-500">{form.formState.errors.screenshot.message as string}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={manualMutation.isPending}>
                  {manualMutation.isPending ? <Spinner size={16} className="mr-2" /> : null}
                  Submit for Verification
                </Button>
              </form>
            )}

            {activeTab === "esewa" && (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
                <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Smartphone size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Pay with eSewa</h3>
                  <p className="text-sm text-zinc-500 max-w-xs mt-1">
                    You will be redirected to the eSewa portal to securely complete your payment of $99.
                  </p>
                </div>
                <Button 
                  onClick={() => walletMutation.mutate("esewa")}
                  disabled={walletMutation.isPending}
                  className="w-full max-w-xs bg-green-600 hover:bg-green-700"
                >
                  {walletMutation.isPending ? <Spinner size={16} className="mr-2" /> : null}
                  Proceed to eSewa
                </Button>
              </div>
            )}

            {activeTab === "khalti" && (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
                <div className="h-20 w-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                  <Smartphone size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Pay with Khalti</h3>
                  <p className="text-sm text-zinc-500 max-w-xs mt-1">
                    You will be redirected to the Khalti portal to securely complete your payment of $99.
                  </p>
                </div>
                <Button 
                  onClick={() => walletMutation.mutate("khalti")}
                  disabled={walletMutation.isPending}
                  className="w-full max-w-xs bg-purple-600 hover:bg-purple-700"
                >
                  {walletMutation.isPending ? <Spinner size={16} className="mr-2" /> : null}
                  Proceed to Khalti
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
