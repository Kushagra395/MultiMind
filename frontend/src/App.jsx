import { useState } from "react"
import ModelCard from "./modelcard"

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [prompt, setPrompt] = useState("")

  function handleSend() {
    if (!inputValue.trim()) return
    setPrompt(inputValue)
    setHasStarted(true)
    setInputValue("")
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend()
  }

  // ─── HOMEPAGE VIEW ───────────────────────────────────────
  if (!hasStarted) {
    return (
      <div className="h-screen w-screen flex flex-col bg-[#050505] text-white font-sans overflow-hidden items-center justify-center relative">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050505] to-[#050505] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center w-full max-w-3xl px-6 -mt-20">
          
          {/* Logo / Icon */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.5)] mb-8">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          
          {/* Main Title */}
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6 drop-shadow-lg text-center pb-2">
            MultiMind
          </h1>
          
          {/* Tagline */}
          <p className="text-lg md:text-xl text-slate-400 mb-12 text-center max-w-2xl leading-relaxed">
            Why prompt on different platforms when you can <span className="text-indigo-300 font-semibold">compare them all right here</span>?
          </p>

          {/* Large Search Bar */}
          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-40 group-focus-within:opacity-75 transition duration-500"></div>
            <div className="relative flex items-center bg-[#0f0f13] border border-white/10 rounded-full shadow-2xl p-3 pl-8">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your prompt here..."
                className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-lg"
                autoFocus
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="ml-4 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-full transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    )
  }

  // ─── STREAMING COMPARISON VIEW ───────────────────────────
  return (
    <div className="h-screen w-screen flex flex-col bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* ─── TOP HEADER ─────────────────────────── */}
      <header className="shrink-0 py-5 px-8 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              MultiMind
            </h1>
          </div>
        </div>
        <p className="text-xs font-medium text-slate-400 tracking-wider uppercase">Live AI Comparison</p>
      </header>

      {/* ─── THREE COLUMNS ── */}
      <main className="flex-1 min-h-0 relative">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050505] to-[#050505] pointer-events-none"></div>

        <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6 p-6 relative z-0">
          <ModelCard 
            modelId="groq-llama" 
            modelName="Llama 3.3 70B" 
            provider="Groq" 
            color="emerald" 
            prompt={prompt} 
          />
          <ModelCard 
            modelId="groq-gemma" 
            modelName="Llama 3.1 8B" 
            provider="Groq" 
            color="violet" 
            prompt={prompt} 
          />
          <ModelCard 
            modelId="gemini-flash" 
            modelName="Gemini 2.5 Flash" 
            provider="Google" 
            color="amber" 
            prompt={prompt} 
          />
        </div>
      </main>

      {/* ─── BOTTOM SEARCH BAR ──────────────────── */}
      <div className="shrink-0 p-6 bg-gradient-to-t from-black via-[#050505] to-transparent relative z-10">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
          <div className="relative flex items-center bg-[#0f0f13] border border-white/10 rounded-full shadow-2xl p-2 pl-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the models a question..."
              className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-base"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="ml-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default App