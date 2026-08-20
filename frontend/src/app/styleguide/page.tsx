export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-background p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Styleguide</h1>
          <p className="text-zinc-500">Base UI components for Evolvix AI Social Manager.</p>
        </div>
        
        {/* We will add components here as we import them */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Buttons</h2>
          <div className="flex gap-4">
            <button className="bg-zinc-900 text-zinc-50 px-4 py-2 rounded-md font-medium text-sm">Primary</button>
            <button className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-md font-medium text-sm">Secondary</button>
            <button className="border border-zinc-200 px-4 py-2 rounded-md font-medium text-sm">Outline</button>
          </div>
        </div>
      </div>
    </div>
  );
}
