import { useState, useEffect, useRef } from "react"

const colorMaps = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    glow: "shadow-[0_0_15px_rgba(139,92,246,0.1)]",
    dot: "bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]"
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
  }
}

function ModelCard({ modelId, modelName, provider, color = "emerald", prompt }) {
  // ─── STATE ───────────────────────────────────────
  // state = component ki memory. Jab state badalti hai, UI re-render hota hai

  const [text, setText] = useState("")          // streaming text yahan store hoga
  const [tokens, setTokens] = useState(null)    // token count
  const [loading, setLoading] = useState(false) // response aa raha hai ya nahi
  
  const scrollRef = useRef(null)
  const theme = colorMaps[color]

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [text])

  // ─── EFFECT — jab prompt badle, naya request bhejo ──
  useEffect(() => {

    // agar prompt khali hai, kuch mat karo
    if (!prompt) return

    async function fetchStream() {    //Ek naya function bana rahe hain andar — kyunki useEffect khud async nahi ho sakta directly, isliye ek alag async function banake usko call karte hain.
      setText("")           // purana text saaf karo
      setTokens(null)       // purana token count saaf karo
      setLoading(true)      // loading shuru

      try {
        // backend ko request bhejo
        const response = await fetch(`http://localhost:3001/api/chat/${modelId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt })
        })

        // response ko stream ki tarah padhne ke liye reader banao
        const reader = response.body.getReader()  //response.body==> poora response data, but raw bytes mein, stream ki tarah — text nahi.
        const decoder = new TextDecoder() //bytes ko readable text mein convert karne wala tool.

        // ─── LOOP — chunks aate rahenge jab tak stream khatam na ho ──
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break  // stream khatam, loop band karo

          // value raw bytes hote hain — text mein convert karo
          const chunk = decoder.decode(value)

          // value (raw bytes)  →  decoder.decode()  →  chunk (text)
          // bytes ke andar →  'data: {"text":" world"}\n\n

          // chunk mein multiple "data: {...}" lines ho sakti hain
          const lines = chunk.split("\n\n").filter(line => line.trim())

          for (const line of lines) {
            const jsonStr = line.replace("data: ", "") //Har line pe loop chalao. "data: " prefix hatao, baaki JSON string ko actual JavaScript object mein convert karo.
            try {
              const data = JSON.parse(jsonStr)
              if (data.text) {
                // naya text purane text ke saath jodo
                setText(prev => prev + data.text)
              }
              if (data.done) {
                // stream khatam, token count save karo
                if(data.usage) {
                  setTokens(data.usage.totalTokens)
                }
                setLoading(false)
              }
            } catch (e) {
              // ignore parse errors for partial chunks
            }
          }
        }
      } catch (err) {
        setText("Error connecting to the model.")
        setLoading(false)
      }
    }

    fetchStream()

  }, [prompt, modelId]) // jab bhi prompt ya modelId badle, yeh poora chalega

  // ─── UI ──────────────────────────────────────────
  return (
    <div className={`flex flex-col h-full rounded-2xl bg-[#0f0f13] border ${theme.border} overflow-hidden backdrop-blur-xl ${theme.glow} transition-all duration-300`}>
      {/* Header */}
      <div className={`px-5 py-4 border-b ${theme.border} flex items-center justify-between ${theme.bg}`}>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${loading ? "animate-pulse " + theme.dot : "bg-slate-600"}`}></div>
          <div>
            <h2 className="font-semibold text-white tracking-wide text-sm">{modelName}</h2>
            <p className={`text-[10px] uppercase tracking-widest font-bold mt-0.5 ${theme.text}`}>{provider}</p>
          </div>
        </div>
        {tokens && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-400 font-mono">
            <span>{tokens}</span>
            <span>tokens</span>
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-5 overflow-y-auto text-[15px] leading-relaxed text-slate-300 whitespace-pre-wrap font-sans custom-scrollbar scroll-smooth"
      >
        {!prompt && !text && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3">
            <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">Waiting for prompt...</p>
          </div>
        )}
        
        {text}
        
        {loading && !text && (
           <div className="flex items-center gap-2 text-slate-500 text-sm h-full justify-center">
             <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
             Thinking...
           </div>
        )}
      </div>
    </div>
  )
}

export default ModelCard