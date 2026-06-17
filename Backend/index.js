// ─── 1. IMPORTS ───────────────────────────────────────────
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"
import { google } from "@ai-sdk/google"

dotenv.config()

// ─── 2. EXPRESS APP ────────────────────────────────────────
const app = express()
app.use(cors())          
app.use(express.json())   

// ─── 3. MODEL DEFINITIONS ──────────────────────────────────
const MODELS = {
  "groq-llama": groq("llama-3.3-70b-versatile"),
  "groq-gemma": groq("gemma2-9b-it"),
  "gemini-flash": google("gemini-2.5-flash"),
}


app.post("/api/chat/:modelId", async (req, res) => {


  const { modelId } = req.params   
  const { prompt } = req.body     


  const model = MODELS[modelId]
  if (!model) {
    return res.status(400).json({ error: "Model not found" })
  }

  
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")

 
  const result = streamText({
    model,
    system: "You are a helpful assistant. Answer concisely.",
    prompt,
  })

  
  for await (const chunk of result.textStream) {
  
    res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`)
  }

 
  const usage = await result.usage
  res.write(`data: ${JSON.stringify({ done: true, usage })}\n\n`)

  res.end()
})

// ─── 5. SERVER START ───────────────────────────────────────
app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001")
})