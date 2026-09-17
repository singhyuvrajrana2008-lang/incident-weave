import { useCallback, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  FileUp,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react"
import { Page, PageHeader } from "../../components/shell/Page"
import { AnalysisProgress } from "../../components/investigation/AnalysisProgress"
import {
  Button,
  EmptyState,
  EvidenceIcon,
  Field,
  Input,
  Panel,
  StatusBadge,
  Textarea,
} from "../../components/ui"
import { investigationService } from "../../lib/services"
import type { EvidenceType } from "../../lib/types"
import { useApp } from "../../store/AppContext"

const MAX_FILE_SIZE = 15 * 1024 * 1024
const ACCEPTED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
  "text/markdown",
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/webm",
])
const ACCEPTED_EXTENSIONS =
  /\.(png|jpe?g|webp|gif|pdf|txt|md|mp3|wav|m4a|webm)$/i

type QueuedFile = { id: string; file: File; type: EvidenceType }

function inferType(file: File): EvidenceType {
  if (file.type.startsWith("image/")) return "image"
  if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) return "pdf"
  if (file.type.startsWith("audio/")) return "audio"
  if (file.type.startsWith("text/") || /\.(txt|md)$/i.test(file.name))
    return "text"
  return "document"
}

export default function NewInvestigation() {
  const nav = useNavigate()
  const { toast } = useApp()
  const inputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] =
    useState<"details" | "evidence" | "review" | "processing">("details")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [incidentDate, setIncidentDate] = useState("")
  const [investigationId, setInvestigationId] = useState<string | null>(null)
  const [files, setFiles] = useState<QueuedFile[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [analysisRunId, setAnalysisRunId] = useState<string | null>(null)

  const addFiles = useCallback(
    (list: FileList | File[]) => {
      const accepted: QueuedFile[] = []
      const rejected: string[] = []
      for (const file of Array.from(list)) {
        if (
          file.size === 0 ||
          file.size > MAX_FILE_SIZE ||
          (!ACCEPTED_TYPES.has(file.type) &&
            !ACCEPTED_EXTENSIONS.test(file.name))
        ) {
          rejected.push(file.name)
        } else {
          accepted.push({
            id: crypto.randomUUID(),
            file,
            type: inferType(file),
          })
        }
      }
      setFiles((current) => [
        ...current,
        ...accepted.filter(
          (candidate) =>
            !current.some(
              (item) =>
                item.file.name === candidate.file.name &&
                item.file.size === candidate.file.size,
            ),
        ),
      ])
      if (rejected.length)
        toast({
          title: "Some files were not added",
          desc: "Use a supported image, PDF, text, or audio file up to 15 MB.",
          kind: "warn",
        })
    },
    [toast],
  )

  async function createInvestigation() {
    if (!name.trim()) return
    setBusy(true)
    setError("")
    try {
      const id = await investigationService.create({
        name: name.trim(),
        description: description.trim(),
        incidentDate,
      })
      setInvestigationId(id)
      setStep("evidence")
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to create the investigation.",
      )
    } finally {
      setBusy(false)
    }
  }

  async function startAnalysis() {
    if (!investigationId || files.length === 0 || busy) return
    setBusy(true)
    setError("")
    try {
      const evidenceIds = await investigationService.uploadEvidence(
        investigationId,
        files.map(({ file }) => file),
      )
      const runId = await investigationService.startAnalysis(
        investigationId,
        evidenceIds,
      )
      setAnalysisRunId(runId)
      setStep("processing")
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Evidence upload or analysis start failed.",
      )
    } finally {
      setBusy(false)
    }
  }

  if (step === "processing" && analysisRunId) {
    return (
      <Page>
        <PageHeader
          eyebrow="Live analysis"
          title={name}
          subtitle="The results shown after this step are returned by the configured analysis service."
        />
        <AnalysisProgress
          analysisRunId={analysisRunId}
          onComplete={() =>
            nav(`/app/investigations/${investigationId}`, { replace: true })
          }
        />
      </Page>
    )
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Guided workflow"
        title="New investigation"
        subtitle="Create a private case, upload evidence, then run the configured Gemini analysis."
      />
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-md border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson"
        >
          {error}
        </div>
      )}
      {step === "details" && (
        <Panel className="max-w-2xl p-6">
          <div className="space-y-4">
            <Field label="Investigation title">
              <Input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>
            <Field label="Description">
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>
            <Field label="Incident date">
              <Input
                type="date"
                value={incidentDate}
                onChange={(event) => setIncidentDate(event.target.value)}
              />
            </Field>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => nav("/app/dashboard")}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={busy}
              disabled={!name.trim()}
              icon={<ArrowRight className="size-4" />}
              onClick={createInvestigation}
            >
              Continue
            </Button>
          </div>
        </Panel>
      )}
      {step === "evidence" && (
        <div className="space-y-4">
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              addFiles(event.dataTransfer.files)
            }}
            className="grid cursor-pointer place-items-center rounded-lg border-2 border-dashed border-line-2 bg-surface px-6 py-14 text-center hover:border-accent/50"
          >
            <input
              ref={inputRef}
              hidden
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.txt,.md,.mp3,.wav,.m4a,.webm"
              onChange={(event) =>
                event.target.files && addFiles(event.target.files)
              }
            />
            <UploadCloud className="size-8 text-accent" />
            <h2 className="mt-4 font-display text-lg font-semibold text-fg">
              Upload evidence
            </h2>
            <p className="mt-1 text-sm text-fg-dim">
              Images, PDFs, text, and audio files up to 15 MB each.
            </p>
            <Button
              className="mt-4"
              variant="secondary"
              icon={<FileUp className="size-4" />}
            >
              Browse files
            </Button>
          </div>
          <Panel>
            {files.length === 0 ? (
              <EmptyState
                icon={<UploadCloud className="size-6" />}
                title="No evidence selected"
                description="Add at least one supported file to continue."
              />
            ) : (
              <div className="divide-y divide-line">
                {files.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-4">
                    <EvidenceIcon type={item.type} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-sm text-fg">
                        {item.file.name}
                      </p>
                      <p className="text-xs text-fg-dim">
                        {(item.file.size / 1_000_000).toFixed(1)} MB ·{" "}
                        {item.type}
                      </p>
                    </div>
                    <StatusBadge status="ready" />
                    <button
                      aria-label={`Remove ${item.file.name}`}
                      onClick={() =>
                        setFiles((current) =>
                          current.filter((file) => file.id !== item.id),
                        )
                      }
                    >
                      <X className="size-4 text-fg-dim hover:text-crimson" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Panel>
          <div className="flex justify-between">
            <Button
              variant="ghost"
              icon={<ArrowLeft className="size-4" />}
              onClick={() => setStep("details")}
            >
              Back
            </Button>
            <Button
              variant="primary"
              disabled={!files.length}
              icon={<ArrowRight className="size-4" />}
              onClick={() => setStep("review")}
            >
              Review evidence
            </Button>
          </div>
        </div>
      )}
      {step === "review" && (
        <Panel className="max-w-3xl p-6 text-center">
          <Sparkles className="mx-auto size-7 text-accent" />
          <h2 className="mt-3 font-display text-xl font-bold text-fg">
            Start real evidence analysis
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-fg-dim">
            This uploads {files.length} evidence file
            {files.length === 1 ? "" : "s"} to private storage and invokes the
            server-side Gemini integration. Failed analysis remains a visible
            failure and can be retried.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button variant="ghost" onClick={() => setStep("evidence")}>
              Back
            </Button>
            <Button
              variant="primary"
              loading={busy}
              icon={<Sparkles className="size-4" />}
              onClick={startAnalysis}
            >
              Run analysis
            </Button>
          </div>
        </Panel>
      )}
    </Page>
  )
}
