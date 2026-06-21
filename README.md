# ⚡ MultiMind

**MultiMind** is a blazing-fast, modern web application that allows you to compare responses from leading AI models side-by-side in real time. It streams responses simultaneously, allowing you to visually analyze the differences in intelligence, tone, and formatting across multiple Large Language Models (LLMs).

![MultiMind Preview](https://github.com/user-attachments/assets/multimind-placeholder-preview.png) *(Note: Replace with an actual screenshot of your gorgeous UI!)*

## ✨ Features

- **Real-time Streaming:** Watch models type out their answers word-by-word simultaneously using Server-Sent Events (SSE).
- **Side-by-Side Comparison:** Three distinct, glassmorphic columns beautifully separate the responses from different AI models.
- **Modern UI/UX:** Built with a glossy, high-contrast aesthetic featuring custom scrollbars, animated borders, and auto-scrolling containers.
- **Split Deployment Architecture:** Optimized for production with the frontend hosted on the global edge network (Vercel) and the streaming backend hosted on a dedicated service (Render).
- **Intelligent Prompting:** The backend utilizes an expert-level system prompt to enforce readable, balanced, and point-wise responses from every model.

## 🧠 Supported Models
MultiMind currently leverages the official **Vercel AI SDK** to connect to:
- **Llama 3.3 70B** (via Groq) - Extremely fast, highly capable open-source model.
- **Llama 3.1 8B** (via Groq) - Lightweight, hyper-fast conversational model.
- **Gemini Flash** (via Google AI) - Multimodal, highly intelligent flagship model.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Deployment:** Vercel

### Backend
- **Framework:** Node.js + Express
- **AI Integration:** Vercel AI SDK (`@ai-sdk/groq`, `@ai-sdk/google`)
- **Deployment:** Render (Web Service)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js installed on your machine
- API keys from **Groq** and **Google AI Studio**

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Kushagra395/MultiMind.git
cd MultiMind
\`\`\`

### 2. Setup the Backend
Navigate to the backend directory, install dependencies, and setup your environment variables.
\`\`\`bash
cd Backend
npm install
\`\`\`
Create a `.env` file inside the `Backend` folder:
\`\`\`env
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
\`\`\`
Start the development server:
\`\`\`bash
node index.js
\`\`\`

### 3. Setup the Frontend
Open a new terminal, navigate to the frontend directory, and start the Vite server.
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
Your MultiMind app should now be running locally at `http://localhost:5173`!

---

## 🌍 Production Deployment Guide

MultiMind is designed to be deployed using a split architecture for maximum performance.

1. **Deploy Backend to Render:**
   - Create a New Web Service.
   - Set the Root Directory to `Backend`.
   - Start command: `node index.js`.
   - Add your API Keys in Render's Environment Variables.
   - Copy the provided Render URL once deployed.

2. **Deploy Frontend to Vercel:**
   - Import the repository.
   - Set Root Directory to `frontend`.
   - In Environment Variables, add `VITE_BACKEND_URL` with the Render URL you copied in step 1.
   - Deploy!

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Kushagra395/MultiMind/issues).

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
