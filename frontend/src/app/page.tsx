import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle2, Search, Calendar, Sparkles, BarChart3, MessageSquare, Briefcase, Zap, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden selection:bg-purple-200">
      
      {/* ----------------- NAVBAR ----------------- */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0510]/80 backdrop-blur-md border-b border-purple-900/30">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            Evolvix<span className="text-purple-400">.ai</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-300">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#solutions" className="hover:text-white transition-colors">Solutions</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors hidden sm:block">
            Sign in
          </Link>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white border-0 rounded-full px-6">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* ----------------- HERO SECTION (DARK) ----------------- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-[#0a0510] overflow-hidden flex flex-col items-center text-center px-4">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/30 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            One AI To Manage <br className="hidden md:block" />
            Every Social <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Conversation.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Streamline content creation, scheduling, and engagement across LinkedIn, Twitter, Instagram, and Facebook in one AI-powered inbox built for growing teams.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 text-lg h-auto border-0">
              <Link href="/register">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg h-auto bg-transparent border-zinc-700 text-white hover:bg-zinc-800 hover:text-white">
              <Play className="mr-2 h-5 w-5 fill-current" /> Watch demo
            </Button>
          </div>
        </div>

        {/* Dashboard Mockup floating below */}
        <div className="relative z-10 mt-20 w-full max-w-6xl mx-auto perspective-[2000px]">
          <div className="rounded-xl overflow-hidden border border-zinc-800/60 shadow-[0_0_100px_rgba(147,51,234,0.3)] bg-[#120a1f] transform rotateX-[5deg] scale-100 transition-transform duration-700 hover:rotate-0 hover:scale-105">
            {/* Mockup Header */}
            <div className="bg-[#1a0f2e] border-b border-zinc-800/50 p-4 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto bg-[#0a0510] border border-zinc-800 rounded-md px-4 py-1 text-xs text-zinc-500 w-64 text-center font-mono">
                app.evolvix.ai
              </div>
            </div>
            {/* Mockup Body */}
            <div className="grid grid-cols-4 h-[600px] text-left">
              {/* Sidebar */}
              <div className="col-span-1 border-r border-zinc-800/50 p-4 space-y-6">
                <div className="space-y-2">
                  <div className="h-8 w-3/4 bg-zinc-800/50 rounded-md" />
                  <div className="h-8 w-full bg-zinc-800/50 rounded-md" />
                  <div className="h-8 w-5/6 bg-purple-900/30 border border-purple-500/30 rounded-md flex items-center px-3">
                    <div className="w-4 h-4 bg-purple-500/50 rounded-sm mr-2" />
                    <div className="h-2 w-16 bg-purple-400/50 rounded" />
                  </div>
                </div>
              </div>
              {/* Main Content */}
              <div className="col-span-3 p-8 bg-gradient-to-br from-[#120a1f] to-[#0a0510] space-y-6 relative overflow-hidden">
                {/* Floating Elements mimicking the PDF design */}
                <div className="absolute top-10 right-10 bg-[#1a0f2e] border border-purple-500/30 p-4 rounded-xl shadow-2xl flex gap-4 w-72 animate-bounce-slow">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex-shrink-0" />
                  <div>
                    <div className="h-3 w-24 bg-zinc-300 rounded mb-2" />
                    <div className="h-2 w-32 bg-zinc-500 rounded" />
                  </div>
                </div>
                
                <div className="h-12 w-1/3 bg-zinc-800/40 rounded-lg" />
                <div className="h-32 w-full bg-zinc-800/30 rounded-xl border border-zinc-800/50" />
                <div className="h-64 w-full bg-zinc-800/30 rounded-xl border border-zinc-800/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- LOGO BAR ----------------- */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2 font-bold text-zinc-900"><div className="w-6 h-6 bg-blue-600 rounded" /> LinkedIn</div>
          <div className="flex items-center gap-2 font-bold text-zinc-900"><div className="w-6 h-6 bg-sky-500 rounded-full" /> Twitter</div>
          <div className="flex items-center gap-2 font-bold text-zinc-900"><div className="w-6 h-6 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-lg" /> Instagram</div>
          <div className="flex items-center gap-2 font-bold text-zinc-900"><div className="w-6 h-6 bg-blue-700 rounded-full" /> Facebook</div>
        </div>
      </section>

      {/* ----------------- FEATURE 1 (WHITE BG) ----------------- */}
      <section className="py-24 bg-white relative overflow-hidden" id="features">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              Every channel in. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">One AI takes over.</span>
            </h2>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Customers reach you on WhatsApp, Instagram, Facebook, your website chat or email. Evolvix AI receives every message, replies in seconds, and pushes the right data to your CRM and your store. Automatically.
            </p>
            <ul className="space-y-3 pt-4">
              {["Omnichannel Inbox", "Instant AI Replies", "CRM Auto-sync"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-zinc-700 font-medium">
                  <CheckCircle2 className="text-purple-600 h-5 w-5" /> {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Visual Side */}
          <div className="relative h-[500px] w-full rounded-3xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            
            {/* Center Node */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-white shadow-xl shadow-purple-200 flex items-center justify-center border-4 border-purple-100 z-20">
              <Sparkles className="text-purple-600 h-10 w-10" />
            </div>

            {/* Orbiting Elements */}
            <div className="absolute w-[300px] h-[300px] border border-dashed border-purple-200 rounded-full animate-spin-slow" />
            <div className="absolute w-[450px] h-[450px] border border-dashed border-blue-200 rounded-full animate-spin-slow-reverse" />
            
            {/* Floating Cards */}
            <div className="absolute top-10 right-10 bg-white p-3 rounded-xl shadow-lg border border-zinc-100 flex items-center gap-3 animate-float">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Search size={14}/></div>
              <div className="text-sm font-semibold">New Lead Saved</div>
            </div>
            
            <div className="absolute bottom-20 left-10 bg-white p-3 rounded-xl shadow-lg border border-zinc-100 flex items-center gap-3 animate-float-delayed">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Calendar size={14}/></div>
              <div className="text-sm font-semibold">Post Scheduled</div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- FEATURE 2 (BENTO GRID) ----------------- */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">Stop chasing every update.</h2>
            <p className="text-lg text-zinc-600">
              Ask Evolvix AI what's happening across your channels and skip the scroll. Everything that matters surfaces in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">Open the app, see everything.</h3>
              <p className="text-zinc-500 mb-8">New leads, urgent replies, missed conversations, all surfaced the moment you open.</p>
              <div className="bg-gradient-to-b from-purple-50 to-white rounded-xl h-64 border border-purple-100 p-4 relative overflow-hidden">
                <div className="w-3/4 bg-white p-4 rounded-lg shadow-sm border border-zinc-100 mb-3 ml-auto text-sm">
                  Can you summarize my engagement for today?
                </div>
                <div className="w-5/6 bg-purple-600 text-white p-4 rounded-lg shadow-sm text-sm">
                  You gained 1,200 impressions on LinkedIn and 400 on Twitter. 3 high-intent comments require your attention.
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">Jump straight into context.</h3>
              <p className="text-zinc-500 mb-8">Ask the AI to show your leads or any open thread, and it opens the full conversation for you.</p>
              <div className="bg-gradient-to-b from-blue-50 to-white rounded-xl h-64 border border-blue-100 p-4 relative overflow-hidden flex flex-col justify-end">
                <div className="bg-white p-3 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full"><Sparkles className="text-purple-600" size={16} /></div>
                  <input type="text" placeholder="Ask Evolvix AI..." className="bg-transparent border-0 outline-none w-full text-sm" disabled />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- STEPS SECTION (DARK) ----------------- */}
      <section className="py-24 bg-[#0a0510] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Live in a few easy steps.</h2>
            <p className="text-zinc-400 text-lg">Connect a channel, train your AI, and you're ready to handle every conversation.</p>
          </div>

          <div className="space-y-0 text-left relative before:absolute before:inset-0 before:ml-[27px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-purple-500 before:to-transparent">
            
            {[
              { num: "01", title: "Connect a social channel", desc: "Connect any one (Instagram, WhatsApp, Facebook, LinkedIn) and you're set." },
              { num: "02", title: "Train your AI Profile", desc: "Set tone, audience, and industry." },
              { num: "03", title: "Schedule Content", desc: "Drag and drop to your calendar." },
              { num: "04", title: "Turn on Evolvix AI", desc: "Let the system auto-publish and predict engagement." }
            ].map((step, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-[#0a0510] bg-purple-600 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_#0a0510,0_0_20px_rgba(147,51,234,0.5)] z-10">
                  {step.num}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#120a1f] p-6 rounded-2xl border border-zinc-800 hover:border-purple-500/50 transition-colors">
                  <h3 className="font-bold text-xl mb-1">{step.title}</h3>
                  <p className="text-zinc-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- AGENT BUILDER SECTION ----------------- */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">Build your own AI agent, <br/> on your own systems.</h2>
            <p className="text-zinc-600 text-lg">
              Your business already runs on its own systems — a CRM, an ecommerce backend. With Agent Builder, your systems answer for themselves, 24/7.
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-purple-100 to-blue-50 rounded-3xl p-2 md:p-8 border border-zinc-200 overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
            
            <div className="bg-white rounded-2xl shadow-lg border border-zinc-100 w-full max-w-4xl mx-auto overflow-hidden relative z-10 flex flex-col h-[500px]">
              {/* Header */}
              <div className="border-b border-zinc-100 p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"><Briefcase size={14} className="text-purple-600"/></div>
                <div className="font-semibold">Brand AI Profile Builder</div>
                <div className="ml-auto text-xs bg-zinc-100 px-2 py-1 rounded text-zinc-500">Draft</div>
              </div>
              {/* Body */}
              <div className="flex-1 bg-zinc-50 p-8 flex flex-col items-center justify-center space-y-6">
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200 max-w-md w-full flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Hi — I'll help you configure your Brand.</p>
                      <p className="text-sm text-zinc-500 mt-1">What industry is your business in?</p>
                    </div>
                 </div>
                 <div className="bg-blue-600 text-white p-4 rounded-xl shadow-sm border border-blue-700 max-w-md w-full ml-12 text-sm">
                    We are a B2B SaaS company focusing on AI tooling.
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200 max-w-md w-full flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Great — I've updated your Tone to "Professional yet Innovative".</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- TESTIMONIALS ----------------- */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">Loved by businesses across the globe.</h2>
            <p className="text-zinc-600">Hundreds of brands use Evolvix to handle social media every day.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { text: "Before Evolvix, our team spent hours writing posts. Now AI handles drafts instantly and we focus on strategy.", author: "Sarah J." },
              { text: "Evolvix completely changed how we run our socials. Posts are automated, and our growth feels almost hands-free now.", author: "Mike T." },
              { text: "We receive thousands of impressions daily. The AI predictions ensure we only post the best content.", author: "Elena R." }
            ].map((t, i) => (
              <Card key={i} className="border-zinc-200 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="text-purple-300 mb-4">
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.4116 0L8.03362 24H0.198364L7.54512 0H13.4116ZM31.1399 0L25.7619 24H17.9267L25.2734 0H31.1399Z"/></svg>
                  </div>
                  <p className="text-zinc-700 italic mb-6">"{t.text}"</p>
                  <p className="font-semibold text-sm text-zinc-900">— {t.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- BOTTOM CTA ----------------- */}
      <section className="py-32 bg-[#0a0510] relative overflow-hidden text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            Every post, <br/> handled automatically.
          </h2>
          <p className="text-zinc-400 text-lg">
            Get started in minutes. Evolvix handles the channels, your team handles the big calls.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 h-12">
              <Link href="/register">Get Started <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 bg-transparent text-white border-zinc-700 hover:bg-zinc-800 hover:text-white">
              Book a demo
            </Button>
          </div>
        </div>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="bg-[#050208] border-t border-zinc-900 pt-16 pb-8 text-zinc-400 text-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white mb-6">
                <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-white">
                  <Sparkles size={12} />
                </div>
                Evolvix.ai
              </div>
              <p className="max-w-xs">The AI-powered omnichannel social platform. One Inbox. Every channel. AI that handles the work.</p>
              <div className="flex gap-4 pt-2">
                <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-colors cursor-pointer text-xs font-bold">𝕏</div>
                <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-colors cursor-pointer text-xs font-bold">in</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Omnichannel Inbox</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Agent Builder</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Analytics</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-purple-400 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-900 text-xs gap-4">
            <p>© 2026 Evolvix AI Inc. Made with ❤️ in SF.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-white">Privacy</Link>
              <Link href="#" className="hover:text-white">Terms</Link>
              <Link href="#" className="hover:text-white">Refund</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
