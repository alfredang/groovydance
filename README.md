# GrooveGen AI Studio

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-API-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com/)

*Last updated: January 31, 2026*

An AI-powered creative studio that transforms photos into dance animations, generates and edits images, analyzes media content, and provides an intelligent assistant - all powered by Google's Gemini AI.

## Features

### Dance Generator
Transform any photo into a dancing character. Upload a person's image, describe a dance move or paste a video reference link, add background music, and generate a dance preview.

### Image Studio
- **Generate**: Create high-quality AI-generated images from text prompts
- **Edit**: Upload an existing image and modify it with natural language instructions

### Analysis Lab
Upload images or videos and ask questions about them. The AI will analyze the content and provide detailed insights, descriptions, or summaries.

### AI Assistant
A conversational assistant with web search grounding. Ask questions and get up-to-date answers with source citations.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **AI**: Google Gemini API (gemini-2.5-flash-image, gemini-3-flash-preview)
- **Backend**: Netlify Functions (serverless)
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/alfredang/groovydance.git
   cd groovydance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npx netlify dev
   ```

   This starts both the Vite dev server and Netlify Functions locally. Open [http://localhost:8888](http://localhost:8888) in your browser.

   > **Note**: Use `netlify dev` instead of `npm run dev` to ensure the serverless functions work locally.

## Deploying to Netlify

### Option 1: Netlify CLI (Recommended)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Create a new site**
   ```bash
   netlify sites:create --name your-site-name
   ```

4. **Set the API key as an environment variable**
   ```bash
   netlify env:set GEMINI_API_KEY your_api_key_here
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Option 2: Git-based Deployment

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com) and create a new site from Git
3. Connect your GitHub repository
4. Add `GEMINI_API_KEY` in **Site settings > Environment variables**
5. Deploy!

## Project Structure

```
groovydance/
├── components/
│   ├── AnalysisLab.tsx    # Media analysis feature
│   ├── ApiKeyGuard.tsx    # API key validation wrapper
│   ├── Assistant.tsx      # AI chat assistant
│   ├── DanceStudio.tsx    # Dance generation feature
│   ├── ImageStudio.tsx    # Image gen/edit feature
│   └── Layout.tsx         # App layout and navigation
├── netlify/
│   └── functions/
│       └── gemini.ts      # Serverless API proxy
├── services/
│   └── geminiService.ts   # Frontend API client
├── App.tsx                # Main app component
├── index.tsx              # Entry point
├── types.ts               # TypeScript types
├── netlify.toml           # Netlify configuration
└── vite.config.ts         # Vite configuration
```

## Security

The Gemini API key is securely stored on the server side using Netlify Functions. The frontend never exposes the API key - all AI requests are proxied through the `/api/gemini` endpoint.

## License

MIT
