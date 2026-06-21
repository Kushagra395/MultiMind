import { useState, useEffect } from "react"

function ModelCard({ modelId, modelName, prompt }) {

  // ─── STATE ───────────────────────────────────────
  // state = component ki memory. Jab state badalti hai, UI re-render hota hai

  const [text, setText] = useState("")        // streaming text yahan store hoga
  const [tokens, setTokens] = useState(null)   // token count
  const [loading, setLoading] = useState(false) // response aa raha hai ya nahi

  // ─── EFFECT — jab prompt badle, naya request bhejo ──
  useEffect(() => {

    // agar prompt khali hai, kuch mat karo
    if (!prompt) return

    async function fetchStream() {    //Ek naya function bana rahe hain andar — kyunki useEffect khud async nahi ho sakta directly, isliye ek alag async function banake usko call karte hain.
      setText("")          // purana text saaf karo
      setTokens(null)       // purana token count saaf karo
      setLoading(true)      // loading shuru

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
          const data = JSON.parse(jsonStr)

          if (data.text) {
            // naya text purane text ke saath jodo
            setText(prev => prev + data.text)
          }

          if (data.done) {
            // stream khatam, token count save karo
            setTokens(data.usage.totalTokens)
            setLoading(false)
          }
        }
      }
    }

    fetchStream()

  }, [prompt, modelId])  // jab bhi prompt ya modelId badle, yeh poora chalega

  // ─── UI ──────────────────────────────────────────
  return (
    <div className="border rounded-lg p-4 bg-white shadow-md flex flex-col h-full">
      <h2 className="font-bold text-lg mb-2">{modelName}</h2>
      
      <div className="flex-1 overflow-y-auto text-sm text-gray-800 whitespace-pre-wrap">
        {text || (loading ? "Thinking..." : "")}
      </div>

      {tokens && (
        <div className="text-xs text-gray-400 mt-2 border-t pt-2">
          Tokens: {tokens}
        </div>
      )}
    </div>
  )
}

export default ModelCard