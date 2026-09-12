# IncidentWeave

IncidentWeave is an AI-assisted multimodal incident and case investigation platform that helps investigators turn fragmented evidence into a clear, traceable incident reconstruction.

## What it does

IncidentWeave brings together evidence such as:

- Images and screenshots
- PDFs and witness statements
- Call logs and messages
- CCTV frames
- Notes and documents
- Audio and transcripts

It then correlates these sources to help reconstruct a chronological timeline, surface contradictions, identify missing or unknown evidence, and support human review.

```text
Fragmented evidence
        ↓
Ingest / extract
        ↓
Cross-modal correlation
        ↓
Timeline reconstruction
        ↓
Contradiction detection
        ↓
Unknown / missing evidence
        ↓
Human investigator review
```

## Core principle

**AI surfaces patterns. Investigators make decisions.**

IncidentWeave is designed as a human-in-the-loop system. AI findings should remain traceable to source evidence and clearly distinguish observed information, inference, and uncertainty.

## Planned technology stack

- React + TypeScript + Vite
- Tailwind CSS + Motion
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Supabase Row Level Security
- Supabase Edge Functions / server-side application logic
- Google Gemini API for multimodal reasoning
- GitHub for version control

## Target workflow

1. Investigator creates an investigation.
2. Evidence is uploaded and securely stored.
3. Evidence is prepared for analysis.
4. Gemini analyzes the evidence across modalities.
5. Structured findings are persisted.
6. IncidentWeave presents the timeline, contradictions, unknowns, confidence and source relationships.
7. The investigator reviews and makes the final decision.

## Project status

This repository is intentionally being reset as a clean starting point for the next implementation phase.

The completed frontend is being maintained separately as the UI source of truth. The backend will be rebuilt cleanly around that frontend using Supabase and Gemini.

## Security principles

- Keep Gemini API credentials server-side.
- Never commit secrets.
- Keep sensitive evidence in private storage.
- Enforce access through Supabase Row Level Security.
- Do not treat AI output as an autonomous legal or criminal verdict.

## Hackathon

**HackDays Solan 2026 — Enkindle Club**

Theme: **Google Gemini API**

Category: **Software / AI / Open Innovation**

## License / demo data

Any future demo evidence should be synthetic or openly licensed and clearly identified as such.
