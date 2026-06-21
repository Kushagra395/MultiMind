// ─── 1. IMPORTS ───────────────────────────────────────────
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"
import { google } from "@ai-sdk/google"
console.log("1");
dotenv.config()

// ─── 2. EXPRESS APP ────────────────────────────────────────
console.log("2");
const app = express()
app.use(cors())          
app.use(express.json())   

// ─── 3. MODEL DEFINITIONS ──────────────────────────────────
console.log("3");
const MODELS = {
  "groq-llama": groq("llama-3.3-70b-versatile"),
   "groq-gemma": groq("llama-3.1-8b-instant"),
  "gemini-flash": google("gemini-2.5-flash"), // THIS MUST BE 1.5, 2.5 DOES NOT EXIST!
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

 
  try {
    const result = streamText({
      model,
      system: `You are an expert AI assistant. Your primary goal is to provide clear, accurate, and highly readable answers.
Please follow these guidelines:
1. Always structure your response using bullet points or numbered lists for better readability.
2. Keep your answers balanced—neither too short nor overly verbose. Provide exactly the amount of detail needed to fully answer the query.
3. Use bold text for key terms to make the response easily scannable.
4. Maintain a professional, helpful, and direct tone.`,
      prompt,
    })

    for await (const chunk of result.textStream) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`)
    }

    const usage = await result.usage
    res.write(`data: ${JSON.stringify({ done: true, usage })}\n\n`)
  } catch (error) {
    console.error("Fatal Streaming Error:", error);
    res.write(`data: ${JSON.stringify({ text: "\n\n[Server Error: " + error.message + "]" })}\n\n`)
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
  } finally {
    res.end()
  }
})
console.log("4");
// ─── 5. SERVER START ───────────────────────────────────────
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})