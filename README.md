# k.vm.s s Chat Bot

Simple chat bot frontend + backend using Google AI API, ready for local use and Vercel deploy.

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Update `.env` with your real key:
   ```env
   GOOGLE_AI_API_KEY=your_real_google_ai_key
   GOOGLE_AI_MODEL=gemini-2.5-flash
   ```
3. Run:
   ```bash
   npm start
   ```
4. Open the URL shown in terminal.
   - If port 3000 is busy, server automatically tries 3001, 3002, etc.

## Vercel deploy

1. Push this project to GitHub.
2. In Vercel, import the repository.
3. Set environment variables in Vercel Project Settings:
   - `GOOGLE_AI_API_KEY` = your real key
   - Optional: `GOOGLE_AI_MODEL` (default: `gemini-2.5-flash`)
4. Deploy.

## Optional: local Vercel mode

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Run:
   ```bash
   vercel dev
   ```
