# IncidentWeave

IncidentWeave is a multimodal incident reconstruction workspace for investigators working with fragmented case evidence. It correlates screenshots, documents, call logs, messages, transcripts and recordings into a source-attributed chronology, surfaces contradictions, and makes evidence gaps explicit.

> **Human-in-the-loop by design:** IncidentWeave organizes and explains evidence. It does not issue an autonomous verdict.

## Product flow

```text
Fragmented evidence
      ↓
Ingest / extract
      ↓
Cross-modal correlation
      ↓
Reconstruct timeline
      ↓
Detect contradictions
      ↓
Identify unknown / missing evidence
      ↓
Human investigator review
```

## Frontend and backend

This repository contains the existing Figma Make-derived frontend foundation, rebuilt into a dark enterprise investigation experience, now connected to Supabase Auth, PostgreSQL, private Storage, Realtime and a server-side Gemini analysis Edge Function.

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Motion for interaction and transitions
- Lucide icons
- Centralized Supabase service layer with realistic fictional demo data retained only as a visual reference

## Core workspace

- Dashboard
- Investigations
- New investigation / evidence intake
- Relationship weave
- Evidence browser
- Timeline reconstruction
- Contradictions
- Unknowns / evidence gaps
- Global search
- Notifications
- Profile and settings

## Demo case

The seeded **Northbridge Incident** demonstrates how separate sources can produce a reconstructed sequence while preserving uncertainty. The demo data is fictional and intended for product demonstration only.

## Backend implementation

The backend is defined in `supabase/migrations/202609120001_incidentweave_backend.sql`. It creates relational tables for profiles, investigations, evidence, extractions, timeline events, contradictions, unknowns, analysis runs/results, notifications and audit logs. Row Level Security restricts every investigation record and private evidence object to its owning authenticated user.

Evidence is stored privately in the `evidence` Storage bucket at `{user_id}/{investigation_id}/{evidence_id}/{filename}`. The browser only receives the public Supabase URL and anon key. `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are used only by `supabase/functions/analyze-evidence` and must never be placed in frontend variables or committed.

Create `.env.local` for the Vite app:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Configure the Edge Function and apply the migration to the existing Supabase project; do not create another database:

```bash
supabase secrets set GEMINI_API_KEY=... SUPABASE_SERVICE_ROLE_KEY=...
supabase db push
supabase functions deploy analyze-evidence
```

The end-to-end flow is: Supabase Auth session → investigation insert → private evidence upload → `analysis_runs` record → server-side Gemini multimodal request → Zod-validated JSON → persisted timeline/contradiction/unknown records → real workspace data.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

The connected Supabase project must be active before the migration and function can be deployed and live-tested. No production secrets are stored in this repository.

## AI disclosure

Gemini is intended for the reasoning and multimodal correlation layer. The interface exposes source attribution, confidence and review states so model output remains inspectable by a human investigator.
