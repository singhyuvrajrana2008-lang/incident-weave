import type { Investigation, AppNotification } from "./types";

const northbridgeEvidence = [
  {
    id: "ev-0041", filename: "call_log.pdf", type: "pdf" as const, size: "1.8 MB", uploadedAt: "Today, 10:14", relevantTime: "10:14:21", status: "verified" as const, confidence: "high" as const, sourceId: "evidence_0041",
    observations: ["Outbound call initiated at 10:14:21, duration 00:04:12.", "Recipient number matches contact referenced in message_capture.png."], relatedEvents: ["evt-2", "evt-4"], relatedContradictions: ["con-1"],
  },
  {
    id: "ev-0042", filename: "message_capture.png", type: "image" as const, size: "4.2 MB", uploadedAt: "Today, 10:12", relevantTime: "10:16:03", status: "verified" as const, confidence: "high" as const, sourceId: "evidence_0042",
    observations: ["Screenshot timestamp reads 10:16, consistent with device clock.", "Message content references a meeting 'in twenty minutes'."], relatedEvents: ["evt-3"], relatedContradictions: [],
  },
  {
    id: "ev-0043", filename: "witness_statement.pdf", type: "pdf" as const, size: "700 KB", uploadedAt: "Today, 10:09", relevantTime: "10:21:12", status: "uncertain" as const, confidence: "medium" as const, sourceId: "evidence_0043",
    observations: ["Statement places subject at north entrance at 'around 10:20'.", "Sequence of events differs from call_log.pdf ordering."], relatedEvents: ["evt-5"], relatedContradictions: ["con-1"],
  },
  {
    id: "ev-0044", filename: "cctv_frame.png", type: "image" as const, size: "2.6 MB", uploadedAt: "Today, 10:05", relevantTime: "10:18:47", status: "verified" as const, confidence: "high" as const, sourceId: "evidence_0044",
    observations: ["Frame extracted at 10:18:47 from lobby camera 03."], relatedEvents: ["evt-4"], relatedContradictions: ["con-2"],
  },
  {
    id: "ev-0045", filename: "incident_notes.txt", type: "text" as const, size: "12 KB", uploadedAt: "Today, 09:58", relevantTime: "10:12:08", status: "ready" as const, confidence: "medium" as const, sourceId: "evidence_0045",
    observations: ["Investigator field notes, partially timestamped."], relatedEvents: ["evt-1"], relatedContradictions: [],
  },
  {
    id: "ev-0046", filename: "audio_transcript.txt", type: "text" as const, size: "34 KB", uploadedAt: "Today, 09:51", relevantTime: "10:21:40", status: "processing" as const, confidence: "low" as const, sourceId: "evidence_0046",
    observations: ["Transcript references an earlier call and a second party."], relatedEvents: ["evt-5"], relatedContradictions: ["con-2"],
  },
];

const northbridgeEvents = [
  { id: "evt-1", time: "10:12:08", date: "Mar 14", title: "Subject enters north concourse", description: "Field notes place the subject entering the north concourse. Partially corroborated by timing metadata.", confidence: "medium" as const, sources: ["ev-0045"], label: "inferred" as const },
  { id: "evt-2", time: "10:14:21", date: "Mar 14", title: "Call initiated between Person A and Person B", description: "Outbound call recorded in the call log, duration 4m 12s. Recipient matches later message thread.", confidence: "high" as const, sources: ["ev-0041"], contradiction: "con-1", label: "evidence-backed" as const },
  { id: "evt-3", time: "10:16:03", date: "Mar 14", title: "Message thread references imminent meeting", description: "Screenshot captures a message referencing a meeting 'in twenty minutes'.", confidence: "high" as const, sources: ["ev-0042"], label: "evidence-backed" as const },
  { id: "evt-4", time: "10:18:47", date: "Mar 14", title: "Subject observed in lobby (Camera 03)", description: "CCTV frame places the subject in the main lobby, moving toward the east corridor.", confidence: "high" as const, sources: ["ev-0044", "ev-0041"], contradiction: "con-2", label: "evidence-backed" as const },
  { id: "evt-5", time: "10:21:12", date: "Mar 14", title: "Witness places subject at north entrance", description: "Witness statement locates the subject at the north entrance — conflicts with CCTV placement three minutes prior.", confidence: "low" as const, sources: ["ev-0043", "ev-0046"], contradiction: "con-2", label: "uncertain" as const },
];

const northbridgeContradictions = [
  { id: "con-1", code: "C-01", title: "Recorded event sequence differs between sources", sourceA: { evidenceId: "ev-0041", label: "Call Log", time: "10:14 PM" }, sourceB: { evidenceId: "ev-0043", label: "Witness Statement", time: "10:21 PM" }, issue: "The recorded sequence of events differs between the two sources.", detail: "The call log establishes contact at 10:14, before any meeting. The witness statement implies the call occurred after the north-entrance sighting.", confidence: "high" as const, status: "open" as const, eventIds: ["evt-2", "evt-5"] },
  { id: "con-2", code: "C-02", title: "Location evidence conflicts with statement", sourceA: { evidenceId: "ev-0044", label: "CCTV Frame", time: "10:18 PM" }, sourceB: { evidenceId: "ev-0043", label: "Witness Statement", time: "10:21 PM" }, issue: "Location described by witness does not align with CCTV placement.", detail: "CCTV places the subject in the lobby at 10:18:47 while the statement places the subject at the north entrance around the same period.", confidence: "medium" as const, status: "reviewing" as const, eventIds: ["evt-4", "evt-5"] },
  { id: "con-3", code: "C-03", title: "Transcript references an unsupported second party", sourceA: { evidenceId: "ev-0046", label: "Audio Transcript", time: "10:21 PM" }, sourceB: { evidenceId: "ev-0041", label: "Call Log", time: "10:14 PM" }, issue: "The transcript introduces a second party not independently supported by the current call record.", detail: "Additional records are needed before treating the second party reference as established.", confidence: "low" as const, status: "open" as const, eventIds: ["evt-2", "evt-5"] },
];

const northbridgeUnknowns = [
  { id: "unk-1", title: "Exact location between 10:14 and 10:22 remains unsupported", description: "Available records do not establish a continuous location trail for the subject during this window.", window: "10:14–10:22", potentialEvidence: ["CCTV camera 02", "Location metadata", "Additional witness statement"], status: "open" as const, severity: "high" as const },
  { id: "unk-2", title: "Origin of second-party reference is unclear", description: "The transcript mentions a second party without a matching independent record.", window: "10:20–10:22", potentialEvidence: ["Original audio", "Call detail records"], status: "investigating" as const, severity: "medium" as const },
];

export const investigations: Investigation[] = [
  { id: "northbridge", slug: "northbridge", name: "Northbridge Incident", status: "complete", createdAt: "Mar 14, 2026", updatedAt: "Today", updatedLabel: "4m ago", incidentDate: "Mar 14, 2026", description: "Multisource reconstruction of the Northbridge incident.", evidenceCount: 18, eventCount: 27, contradictionCount: 3, unknownCount: 2, confidence: 87, coverage: { verified: 14, uncertain: 3, missing: 2 }, timelineConfidence: 89, requiresReview: 3, evidence: northbridgeEvidence, events: northbridgeEvents, contradictions: northbridgeContradictions, unknowns: northbridgeUnknowns, activity: [
    { time: "Today, 10:22", text: "3 contradictions detected", kind: "danger" },
    { time: "Today, 10:18", text: "Timeline reconstructed", kind: "success" },
    { time: "Today, 10:14", text: "Evidence processing completed", kind: "info" },
  ] },
  { id: "airport", slug: "airport-concourse", name: "Airport Concourse Incident", status: "analyzing", createdAt: "Mar 08, 2026", updatedAt: "Today", updatedLabel: "21m ago", incidentDate: "Mar 08, 2026", description: "Cross-reference of statements, access records and images.", evidenceCount: 12, eventCount: 18, contradictionCount: 1, unknownCount: 4, confidence: 74, coverage: { verified: 8, uncertain: 2, missing: 4 }, timelineConfidence: 77, requiresReview: 2, evidence: northbridgeEvidence.slice(0, 4), events: northbridgeEvents.slice(0, 4), contradictions: northbridgeContradictions.slice(0, 1), unknowns: northbridgeUnknowns, activity: [{ time: "Today, 10:01", text: "Analysis resumed", kind: "info" }] },
  { id: "harbor", slug: "harbor-statement", name: "Harbor Statement Review", status: "ready", createdAt: "Mar 04, 2026", updatedAt: "Yesterday", updatedLabel: "1d ago", incidentDate: "Mar 04, 2026", description: "Statement and communication record correlation.", evidenceCount: 9, eventCount: 13, contradictionCount: 2, unknownCount: 3, confidence: 68, coverage: { verified: 6, uncertain: 2, missing: 2 }, timelineConfidence: 71, requiresReview: 2, evidence: northbridgeEvidence.slice(1, 5), events: northbridgeEvents.slice(1, 4), contradictions: northbridgeContradictions.slice(0, 2), unknowns: northbridgeUnknowns.slice(0, 2), activity: [{ time: "Yesterday", text: "Ready for review", kind: "success" }] },
  { id: "closed", slug: "closed-reconstruction", name: "Closed Reconstruction", status: "archived", createdAt: "Mar 01, 2026", updatedAt: "Mar 05", updatedLabel: "1w ago", incidentDate: "Mar 01, 2026", description: "Closed reconstruction with all contradictions resolved.", evidenceCount: 22, eventCount: 31, contradictionCount: 0, unknownCount: 1, confidence: 91, coverage: { verified: 20, uncertain: 1, missing: 1 }, timelineConfidence: 93, requiresReview: 0, evidence: northbridgeEvidence.slice(0, 5), events: northbridgeEvents.slice(0, 4), contradictions: [], unknowns: northbridgeUnknowns.slice(0, 1), activity: [{ time: "Mar 05", text: "Investigation archived", kind: "success" }] },
];

export const notifications: AppNotification[] = [
  { id: "n1", title: "Analysis completed", body: "Northbridge Incident reconstruction is ready for review.", time: "4m ago", read: false, kind: "success" },
  { id: "n2", title: "3 contradictions detected", body: "Conflicting evidence found across call log and witness statement.", time: "6m ago", read: false, kind: "danger" },
  { id: "n3", title: "Unknown evidence identified", body: "Location between 10:14 and 10:22 remains unsupported.", time: "8m ago", read: false, kind: "warn" },
  { id: "n4", title: "Evidence processing completed", body: "message_capture.png finished processing.", time: "12m ago", read: true, kind: "info" },
  { id: "n5", title: "Investigation requires review", body: "Airport Concourse Incident has items awaiting investigator review.", time: "21m ago", read: true, kind: "warn" },
];
