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

## Frontend

This repository currently contains the Figma Make-derived frontend foundation, rebuilt into a dark enterprise investigation experience.

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Motion for interaction and transitions
- Lucide icons
- Local demo service layer with realistic fictional case data

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

## Backend handoff

The frontend service layer intentionally isolates authentication, investigations and notifications behind async service functions. The next backend integration can replace these implementations with Supabase persistence and Gemini-based multimodal analysis without rewriting the workspace UI.

## Run locally

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
```

## AI disclosure

Gemini is intended for the reasoning and multimodal correlation layer. The interface exposes source attribution, confidence and review states so model output remains inspectable by a human investigator.
