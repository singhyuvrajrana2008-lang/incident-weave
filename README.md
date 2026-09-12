# IncidentWeave

IncidentWeave is an AI-assisted, evidence-backed, confidence-aware investigation workspace. It accepts images, screenshots, PDFs, documents, text notes, call records, messages, audio, transcripts, and CCTV frames, then helps a human investigator correlate sources, reconstruct a timeline, surface potential contradictions, and identify evidence gaps. It does not make legal or criminal judgments.

## Architecture

The preserved React/Vite frontend calls a centralized service layer. The browser uses Supabase Auth, the anon key, RLS-protected PostgreSQL, and a private Storage bucket. Analysis is created as a persistent `analysis_runs` row and invoked through the `analyze-evidence` Supabase Edge Function. The function downloads the private evidence server-side and sends actual text parts or Gemini `inlineData` bytes for images, PDFs, and supported audio—not merely signed URLs in a prompt. `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are Edge Function secrets only.

## Prerequisites

You need Node.js 18+, npm, a Supabase project, the Supabase CLI, and a Gemini API key with access to a current multimodal Gemini model. The checked-in default is `gemini-3.8-flash`; set `GEMINI_MODEL` if your project uses another currently supported model.

## Local setup

1. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Link the local folder to Supabase and apply migrations with `supabase db push`.
3. The migrations create the private `evidence` bucket, ownership policies, relational tables, RLS policies, indexes, and an active-analysis uniqueness constraint.
4. Configure Supabase Auth email confirmation and password-reset redirect URLs for the Vite origin. The Vite config uses port 8443 unless overridden; use the URL printed by `npm run dev`.
5. Set server secrets with `supabase secrets set GEMINI_API_KEY=... GEMINI_MODEL=gemini-3.8-flash SUPABASE_SERVICE_ROLE_KEY=...`.
6. Deploy the function with `supabase functions deploy analyze-evidence`.
7. Install and run the app: `npm install`, `npm run build`, then `npm run dev`.

## End-to-end flow

After authentication, create an investigation and add real files. Each file is uploaded to `user_id/investigation_id/evidence_id/filename`, then its metadata is written to `evidence`. If the database insert fails after Storage succeeds, the service removes the orphaned object. Starting analysis creates one canonical `analysisRunId`, refuses a second queued/processing run, sets the investigation to `analyzing`, and invokes the Edge Function.

The function persists stages and progress, downloads each private object, sends text directly or binary content through Gemini multimodal parts, retries transient Gemini failures, validates the required JSON shape and confidence/basis values, replaces prior generated results safely, writes timeline events, contradictions, unknowns, notifications, and audit entries, and finally marks the run complete. Failures mark the run failed and create a user notification without exposing a stack trace. The frontend polls the persisted run state and reads results from Supabase after refresh.

## Security

RLS restricts profiles, investigations, evidence, analysis runs, extractions, timeline events, contradictions, unknowns, notifications, and audit records to the authenticated owner. Storage is private and its object policies require the first path segment to equal the authenticated user ID. The service role key and Gemini key must never be placed in `.env` variables prefixed with `VITE_`.

## Testing and limitations

Run `npm install`, `npm run build`, and `npx tsc --noEmit`. A complete live Auth/Storage/Gemini test requires your Supabase URL/key, deployed migrations, function secrets, and a Gemini-enabled project; those external credentials are intentionally not included in this ZIP. The function enforces a 15 MB per-file inline analysis limit to avoid oversized Gemini requests. Large files should be preprocessed or chunked in a future iteration. Audio support depends on the MIME type/model capabilities enabled by the selected Gemini model.
