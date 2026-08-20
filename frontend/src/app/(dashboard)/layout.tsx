"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { LogOut, Home, Briefcase, Calendar, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    if (!useAuthStore.getState().accessToken) {
      router.push("/login");
    }
  }, [router]);

  if (!isMounted || !user) {
    return null; // or a loading spinner
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { label: "Overview", icon: Home, href: "/" },
    { label: "Brands", icon: Briefcase, href: "/brands" },
    { label: "Content", icon: LayoutDashboard, href: "/content" },
    { label: "Calendar", icon: Calendar, href: "/calendar" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white px-6">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-white">E</div>
          Evolvix AI
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm font-medium">
            {user.email}
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="h-8 w-8 rounded-full">
            <LogOut size={16} />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-zinc-200 bg-white hidden md:block">
          <nav className="grid gap-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-zinc-100 text-zinc-900" 
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
