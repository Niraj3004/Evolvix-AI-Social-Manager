import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  BarChart3, 
  MessageSquare, 
  Calendar, 
  Layers, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  Menu
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFC] font-sans selection:bg-black selection:text-white overflow-x-hidden text-zinc-950">
      
      {/* ----------------- NAVBAR ----------------- */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-lg border-b border-zinc-200">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shadow-sm">
              <Sparkles size={16} />
            </div>
            Evolvix
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-600">
            <Link href="#features" className="hover:text-black transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-black transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-black transition-colors">Pricing</Link>
            <Link href="#customers" className="hover:text-black transition-colors">Customers</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors hidden sm:block">
            Sign in
          </Link>
          <Button asChild className="bg-black text-white hover:bg-zinc-800 rounded-full px-5 h-9 shadow-sm hidden md:inline-flex">
            <Link href="/register">Get Started</Link>
          </Button>
          <button className="md:hidden text-zinc-900"><Menu size={24} /></button>
        </div>
      </nav>

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-sm font-medium text-zinc-800 shadow-sm animate-fade-in-up">
            <Sparkles size={14} className="text-indigo-600" />
            <span>Introducing Agentic AI 2.0</span>
            <span className="text-zinc-300 mx-1">|</span>
            <Link href="/register" className="flex items-center text-indigo-600 hover:text-indigo-700 group">
              Read the launch post <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-zinc-950 leading-[1.05] animate-fade-in-up animation-delay-100 max-w-4xl">
            Social media management, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900">automated by AI.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Stop guessing what to post. Evolvix learns your brand, predicts engagement, and schedules high-converting content across every channel automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up animation-delay-300 w-full sm:w-auto">
            <Button asChild size="lg" className="w-full sm:w-auto bg-black hover:bg-zinc-800 text-white rounded-full px-8 h-12 text-base shadow-lg shadow-black/10">
              <Link href="/register">Start for free</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 h-12 text-base border-zinc-200 text-zinc-800 hover:bg-zinc-50 shadow-sm">
              Book a demo
            </Button>
          </div>
        </div>

        {/* Hero Mockup */}
        <div className="relative z-10 mt-20 w-full max-w-6xl mx-auto animate-fade-in-up animation-delay-400">
          <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-2xl shadow-zinc-200/50 bg-white ring-1 ring-black/5 flex flex-col">
            {/* Mockup Header */}
            <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-3 flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-300" />
                <div className="w-3 h-3 rounded-full bg-zinc-300" />
                <div className="w-3 h-3 rounded-full bg-zinc-300" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white border border-zinc-200 rounded-md px-32 py-1.5 text-xs text-zinc-400 flex items-center gap-2 shadow-sm">
                  <span className="w-3 h-3 border-2 border-zinc-300 rounded-full" />
                  evolvix.ai/dashboard
                </div>
              </div>
            </div>
            {/* Mockup Body */}
            <div className="flex h-[400px] md:h-[600px] bg-white">
              {/* Sidebar */}
              <div className="w-64 border-r border-zinc-100 p-4 hidden md:flex flex-col gap-6">
                <div className="h-6 w-24 bg-zinc-100 rounded mb-4" />
                <div className="space-y-3">
                  <div className="h-8 w-full bg-zinc-100 rounded-md" />
                  <div className="h-8 w-5/6 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md flex items-center px-3 gap-2">
                    <Sparkles size={14} />
                    <div className="h-3 w-16 bg-indigo-200 rounded" />
                  </div>
                  <div className="h-8 w-full bg-zinc-100 rounded-md" />
                  <div className="h-8 w-4/5 bg-zinc-100 rounded-md" />
                </div>
              </div>
              {/* Content area */}
              <div className="flex-1 p-8 bg-zinc-50/50 relative overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="h-8 w-48 bg-zinc-200 rounded-lg mb-2" />
                      <div className="h-4 w-64 bg-zinc-100 rounded" />
                    </div>
                    <div className="h-10 w-32 bg-black rounded-lg" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm h-32 flex flex-col justify-between">
                        <div className="h-4 w-8 bg-zinc-100 rounded" />
                        <div className="space-y-2">
                          <div className="h-6 w-24 bg-zinc-200 rounded" />
                          <div className="h-3 w-16 bg-green-100 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm h-64 flex gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="h-5 w-32 bg-zinc-200 rounded" />
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-zinc-100 rounded" />
                        <div className="h-3 w-full bg-zinc-100 rounded" />
                        <div className="h-3 w-4/5 bg-zinc-100 rounded" />
                      </div>
                    </div>
                    <div className="w-1/3 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-center">
                       <BarChart3 size={32} className="text-zinc-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- LOGO CLOUD ----------------- */}
      <section className="py-10 border-b border-zinc-200 bg-white overflow-hidden">
        <p className="text-center text-sm font-medium text-zinc-500 mb-8 uppercase tracking-widest">Trusted by innovative teams worldwide</p>
        <div className="relative w-full max-w-7xl mx-auto flex overflow-hidden mask-edges">
          <div className="flex whitespace-nowrap animate-marquee gap-16 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Creating fake logos using standard text/shapes for aesthetics */}
             {[1, 2].map((group) => (
               <React.Fragment key={group}>
                  <div className="text-xl font-bold font-serif flex items-center gap-1"><div className="w-4 h-4 bg-black rounded-sm"/> ACME Corp</div>
                  <div className="text-xl font-bold tracking-tighter flex items-center gap-1"><div className="w-4 h-4 rounded-full border-2 border-black"/> Vercel</div>
                  <div className="text-xl font-bold font-mono">STRIPE</div>
                  <div className="text-xl font-extrabold italic">Figma</div>
                  <div className="text-xl font-bold flex items-center gap-1"><div className="w-0 h-0 border-l-[10px] border-l-transparent border-b-[15px] border-b-black border-r-[10px] border-r-transparent"/> Notion</div>
                  <div className="text-xl font-bold tracking-widest">LINEAR</div>
               </React.Fragment>
             ))}
          </div>
        </div>
      </section>

      {/* ----------------- BENTO GRID FEATURES ----------------- */}
      <section id="features" className="py-32 bg-[#FDFDFC] px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950">
              Everything you need to scale your brand.
            </h2>
            <p className="text-lg text-zinc-500">
              Stop juggling ten different tools. Evolvix brings AI generation, scheduling, and analytics into one seamless workspace.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Card 1: Large */}
            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm relative overflow-hidden group">
              <div className="relative z-10 w-2/3">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3">AI-Powered Content Generation</h3>
                <p className="text-zinc-500 leading-relaxed">
                  Train your Brand AI Profile with your industry, tone, and audience. Watch it generate weeks of hyper-relevant content in seconds.
                </p>
              </div>
              {/* Graphic */}
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-gradient-to-tl from-indigo-100 to-transparent rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Card 2: Small */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm flex flex-col group">
              <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-xl flex items-center justify-center mb-auto">
                <Calendar size={24} />
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-2">Smart Scheduling</h3>
                <p className="text-zinc-500 text-sm">Drag and drop posts to your calendar. We'll handle the rest.</p>
              </div>
            </div>

            {/* Card 3: Small */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm flex flex-col group">
               <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-xl flex items-center justify-center mb-auto">
                <BarChart3 size={24} />
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-2">Predictive Analytics</h3>
                <p className="text-zinc-500 text-sm">Know exactly how a post will perform before you even hit publish.</p>
              </div>
            </div>

            {/* Card 4: Large */}
            <div className="md:col-span-2 bg-zinc-950 text-white rounded-3xl p-8 border border-zinc-800 shadow-xl relative overflow-hidden group">
              <div className="relative z-10 w-2/3">
                <div className="w-12 h-12 bg-zinc-800 text-white rounded-xl flex items-center justify-center mb-6">
                  <Layers size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Omnichannel Inbox</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Manage LinkedIn, Twitter, Facebook, and Instagram from a single unified dashboard. Reply to comments and DMs instantly.
                </p>
              </div>
               {/* Graphic */}
              <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-l from-indigo-600/30 to-transparent blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- HOW IT WORKS (SPLIT SCREEN) ----------------- */}
      <section id="how-it-works" className="py-32 bg-white border-y border-zinc-200 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 mb-4">
                Works like magic. <br/> Feels like software.
              </h2>
              <p className="text-lg text-zinc-500">
                A structured, repeatable workflow that takes the chaos out of social media management.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { title: "Connect your channels", desc: "Securely link your social media accounts via OAuth in one click.", icon: Zap },
                { title: "Train your AI Profile", desc: "Define your brand voice, target audience, and industry goals.", icon: ShieldCheck },
                { title: "Review & Approve", desc: "Let the AI draft content. You maintain full editorial control.", icon: MessageSquare }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 group cursor-default">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-900 group-hover:bg-black group-hover:text-white transition-colors">
                    <step.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-zinc-900 mb-1 group-hover:text-black transition-colors">{step.title}</h4>
                    <p className="text-zinc-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            {/* Floating UI Element */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-4 shadow-xl aspect-square flex flex-col relative overflow-hidden">
               <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
                 <div className="font-semibold text-zinc-800 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500" /> System Status
                 </div>
                 <div className="text-xs font-mono text-zinc-400">v2.0.4</div>
               </div>
               
               <div className="flex-1 flex flex-col gap-3">
                 <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm flex justify-between items-center animate-fade-in-up">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">in</div>
                     <span className="font-medium text-sm">LinkedIn Connected</span>
                   </div>
                   <CheckCircle2 size={16} className="text-green-500" />
                 </div>

                 <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm flex justify-between items-center animate-fade-in-up animation-delay-100">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center font-bold">𝕏</div>
                     <span className="font-medium text-sm">Twitter Connected</span>
                   </div>
                   <CheckCircle2 size={16} className="text-green-500" />
                 </div>

                 <div className="mt-auto bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                    <Sparkles size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-indigo-900 mb-1">AI Agent Active</h5>
                      <p className="text-xs text-indigo-700">Your brand profile has been analyzed. Ready to generate 14 posts.</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- PRICING ----------------- */}
      <section id="pricing" className="py-32 bg-[#FDFDFC] px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950">
              Simple, transparent pricing.
            </h2>
            <p className="text-lg text-zinc-500">
              No hidden fees. No surprise charges. Start for free and scale as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="rounded-3xl border-zinc-200 shadow-sm flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">Starter</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold tracking-tight">$0</span>
                  <span className="text-zinc-500">/mo</span>
                </div>
                <p className="text-zinc-500 text-sm mb-6 pb-6 border-b border-zinc-100">
                  Perfect for individuals trying out AI social management.
                </p>
                <ul className="space-y-3 mb-8 flex-1 text-sm text-zinc-700">
                  <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-black"/> 1 Brand Profile</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-black"/> 3 Social Accounts</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-black"/> 20 AI Generations /mo</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-black"/> Basic Analytics</li>
                </ul>
                <Button className="w-full rounded-full bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-200 shadow-none">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="rounded-3xl border-black shadow-xl flex flex-col relative scale-105 z-10 bg-black text-white">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </div>
              <CardContent className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold tracking-tight">$49</span>
                  <span className="text-zinc-400">/mo</span>
                </div>
                <p className="text-zinc-400 text-sm mb-6 pb-6 border-b border-zinc-800">
                  For growing teams and active creators who need scale.
                </p>
                <ul className="space-y-3 mb-8 flex-1 text-sm text-zinc-300">
                  <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-indigo-400"/> 5 Brand Profiles</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-indigo-400"/> Unlimited Socials</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-indigo-400"/> 500 AI Generations /mo</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-indigo-400"/> Predictive ML Analytics</li>
                </ul>
                <Button className="w-full rounded-full bg-white hover:bg-zinc-200 text-black border border-zinc-200">
                  Start 14-Day Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="rounded-3xl border-zinc-200 shadow-sm flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold tracking-tight">Custom</span>
                </div>
                <p className="text-zinc-500 text-sm mb-6 pb-6 border-b border-zinc-100">
                  For large agencies requiring custom infrastructure.
                </p>
                <ul className="space-y-3 mb-8 flex-1 text-sm text-zinc-700">
                  <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-black"/> Unlimited Brands</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-black"/> Custom ML Models</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-black"/> Dedicated Account Manager</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 size={16} className="text-black"/> SLA & Custom Contracts</li>
                </ul>
                <Button className="w-full rounded-full bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-200 shadow-none">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ----------------- BOTTOM CTA ----------------- */}
      <section className="py-32 bg-zinc-950 text-white relative overflow-hidden text-center px-6 border-t border-zinc-900">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Ready to upgrade your workflow?
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl">
            Join thousands of modern teams managing their social presence with Evolvix. Set up in minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-white hover:bg-zinc-200 text-black rounded-full px-8 h-12 shadow-lg">
              <Link href="/register">Get Started Free <ChevronRight className="ml-1 h-4 w-4"/></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ----------------- MEGA FOOTER ----------------- */}
      <footer className="bg-white border-t border-zinc-200 pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-950">
              <div className="w-6 h-6 rounded-md bg-black flex items-center justify-center text-white">
                <Sparkles size={12} />
              </div>
              Evolvix
            </Link>
            <p className="max-w-xs text-sm text-zinc-500 leading-relaxed">
              The AI-native social media manager. We build tools that give marketing teams superpowers.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-950 text-sm">Product</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-black transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-950 text-sm">Resources</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-black transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Support</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-950 text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-black transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Legal</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-200 text-sm text-zinc-400 gap-4">
          <p>© 2026 Evolvix AI Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-zinc-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-zinc-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
