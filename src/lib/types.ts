export type EvidenceType = "image" | "pdf" | "document" | "audio" | "text";
export type Confidence = "high" | "medium" | "low";
export type EvidenceStatus = "ready" | "processing" | "verified" | "uncertain" | "error";
export type InvestigationStatus = "draft" | "ready" | "analyzing" | "complete" | "archived";
export type AnalysisStatus = "idle" | "uploading" | "processing" | "complete" | "error";
export type ReviewStatus = "open" | "reviewing" | "resolved" | "dismissed" | "investigating";

export interface Evidence {
  id: string;
  filename: string;
  type: EvidenceType;
  size: string;
  uploadedAt: string;
  relevantTime: string;
  status: EvidenceStatus;
  confidence: Confidence;
  sourceId: string;
  observations: string[];
  relatedEvents: string[]; // event ids
  relatedContradictions: string[]; // contradiction ids
  notes?: string;
}

export interface TimelineEvent {
  id: string;
  time: string; // HH:MM:SS
  date: string;
  title: string;
  description: string;
  confidence: Confidence;
  sources: string[]; // evidence ids
  contradiction?: string; // contradiction id if involved
  label: "evidence-backed" | "inferred" | "ai-observation" | "uncertain";
}

export interface Contradiction {
  id: string;
  code: string;
  title: string;
  sourceA: { evidenceId: string; label: string; time: string };
  sourceB: { evidenceId: string; label: string; time: string };
  issue: string;
  detail: string;
  confidence: Confidence;
  status: ReviewStatus;
  eventIds: string[];
  notes?: string;
}

export interface Unknown {
  id: string;
  title: string;
  description: string;
  window: string;
  potentialEvidence: string[];
  status: ReviewStatus;
  severity: Confidence;
}

export interface Investigation {
  id: string;
  name: string;
  slug: string;
  status: InvestigationStatus;
  createdAt: string;
  updatedAt: string;
  updatedLabel: string;
  incidentDate: string;
  description: string;
  evidenceCount: number;
  eventCount: number;
  contradictionCount: number;
  unknownCount: number;
  confidence: number;
  coverage: { verified: number; uncertain: number; missing: number };
  timelineConfidence: number;
  requiresReview: number;
  evidence: Evidence[];
  events: TimelineEvent[];
  contradictions: Contradiction[];
  unknowns: Unknown[];
  activity: { time: string; text: string; kind: "info" | "warn" | "success" | "danger" }[];
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: "info" | "success" | "warn" | "danger";
}
