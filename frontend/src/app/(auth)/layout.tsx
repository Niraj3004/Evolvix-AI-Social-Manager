export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Evolvix AI</h1>
          <p className="text-sm text-zinc-500">Social Manager</p>
        </div>
        {children}
      </div>
    </div>
  );
}
