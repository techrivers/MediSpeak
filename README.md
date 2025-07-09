# SpeakBridge

This is a Next.js starter project for Firebase Studio.

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd speakbridge
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add your environment variables. Example:

```env
# .env example
GEMINI_API_KEY=gemini_api_key
```

> **Note:** Replace the values with your actual Firebase project credentials or other required secrets.

### 4. Run the development server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

- `src/app/` - Main application pages and layouts
- `src/components/` - Reusable UI components
- `src/contexts/` - React context providers
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility libraries
- `src/ai/` - AI and language processing flows

## Additional Notes

- For more details, see the code in `src/app/page.tsx`.
- Make sure to keep your `.env.local` file private and never commit it to version control.
