import { ArrowLeft, Terminal } from 'lucide-react'

export default function NotFound({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex flex-col items-center justify-center p-6 font-mono text-center">
      <div className="w-12 h-12 rounded bg-[#10121a] border border-white/15 flex items-center justify-center text-blue-400 mb-6">
        <Terminal size={22} />
      </div>

      <div className="text-xs uppercase tracking-widest text-blue-400 mb-2 font-bold">
        HTTP 404 · Resource Not Located
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 font-sans">
        Endpoint Not Found
      </h1>

      <p className="text-slate-400 text-sm max-w-md mb-8 font-sans leading-relaxed">
        The requested address does not correspond to an active route or resource in this engineering portfolio.
      </p>

      <button
        onClick={onGoHome}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs uppercase tracking-wider transition-all"
      >
        <ArrowLeft size={14} />
        <span>Return to Portfolio</span>
      </button>

      <div className="mt-12 text-[11px] text-slate-500">
        Chenthil Hari · Portfolio System
      </div>
    </div>
  )
}
