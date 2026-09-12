# IncidentWeave architecture

## Frontend boundaries

```text
src/
├── components/
│   ├── investigation/   # relationship map, timeline, inspectors, analysis progress
│   ├── landing/         # public product visualization
│   ├── shell/           # authenticated application chrome
│   └── ui/              # reusable interface primitives
├── lib/
│   ├── data.ts          # fictional demo data
│   ├── services.ts      # async boundary for auth/investigations/notifications
│   └── types.ts         # shared contracts
├── pages/
│   ├── auth/            # sign in / sign up / password reset
│   └── app/             # authenticated product workspace
└── store/
    └── AppContext.tsx   # session, toast, notification and workspace state
```

## Evidence model

An investigation is represented as a set of evidence objects, reconstructed timeline events, contradictions and unknowns. Timeline events link back to evidence so the UI can explain where each finding came from.

The intended production flow is:

1. Evidence is uploaded to storage.
2. OCR, transcription and metadata extraction normalize each source.
3. Gemini correlates entities, timestamps and claims across modalities.
4. A strict structured result populates timeline, contradiction and unknown records.
5. The investigator reviews, annotates and resolves findings.

## Trust boundary

The UI should distinguish between:

- **evidence-backed** — directly supported by a source
- **inferred** — derived from multiple sources
- **AI observation** — model-generated observation that still needs review
- **uncertain** — insufficient or conflicting evidence

Final judgment remains with the investigator.
