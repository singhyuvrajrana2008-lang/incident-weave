# IncidentWeave

IncidentWeave is an AI-assisted multimodal investigation and incident reconstruction platform. This repository currently contains the Figma-generated React frontend. The backend integration will connect this UI to Supabase and Gemini.

## Frontend

- React 19 + TypeScript
- Vite
- React Router
- Tailwind CSS
- Motion

## Run locally

```bash
pnpm install
pnpm dev
```

Build:

```bash
pnpm build
```

## Backend integration

The current frontend includes a centralized mock service layer in `src/lib/services.ts`. The backend phase will replace that layer with real API/Supabase/Gemini integrations without redesigning the UI.
