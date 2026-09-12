import type { Evidence, Investigation, TimelineEvent, Contradiction, Unknown } from "./types";

const evidence: Evidence[] = [
  { id: "demo-ev-security", filename: "security_log.txt", type: "text", size: "2.1 KB", uploadedAt: "12 Sep 2026, 18:01", relevantTime: "18:02–18:26", status: "verified", confidence: "high", sourceId: "SEC-01", observations: ["PX-1042 scanned at Dock 3 at 18:02.", "PX-1042 marked loaded at 18:07.", "Dock 3 CCTV interruption at 18:14.", "Package reported missing at 18:21."], relatedEvents: ["demo-ev-1", "demo-ev-2", "demo-ev-7", "demo-ev-10"], relatedContradictions: ["demo-con-1"] },
  { id: "demo-ev-access", filename: "access_log.txt", type: "text", size: "1.4 KB", uploadedAt: "12 Sep 2026, 18:01", relevantTime: "18:09–18:19", status: "verified", confidence: "high", sourceId: "ACC-01", observations: ["Alex Morgan entered Dock 3 at 18:09.", "Sam Carter entered Dock 3 at 18:13.", "Vehicle 17 departed at 18:19."], relatedEvents: ["demo-ev-3", "demo-ev-5", "demo-ev-6", "demo-ev-8", "demo-ev-9"], relatedContradictions: [] },
  { id: "demo-ev-statement", filename: "employee_statement.txt", type: "text", size: "1.8 KB", uploadedAt: "12 Sep 2026, 18:01", relevantTime: "18:10", status: "verified", confidence: "medium", sourceId: "STA-01", observations: ["Alex Morgan reported seeing PX-1042 near Dock 3 at approximately 18:10."], relatedEvents: ["demo-ev-4"], relatedContradictions: [] },
  { id: "demo-ev-dispatch", filename: "dispatch_report.txt", type: "text", size: "1.2 KB", uploadedAt: "12 Sep 2026, 18:01", relevantTime: "18:15–18:19", status: "verified", confidence: "high", sourceId: "DSP-01", observations: ["Vehicle 17 departed at 18:19.", "Driver confirmed PX-1042 was not loaded.", "Package was not found during the initial search."], relatedEvents: ["demo-ev-9", "demo-ev-10"], relatedContradictions: ["demo-con-1"] },
];

const events: TimelineEvent[] = [
  ["18:02:00", "PX-1042 scanned at Dock 3", "Security log records the package entering the Dock 3 workflow.", "high", "evidence-backed", ["demo-ev-security"]],
  ["18:07:00", "PX-1042 marked as loaded", "Security system records the package as loaded for outbound dispatch.", "high", "evidence-backed", ["demo-ev-security"]],
  ["18:09:00", "Alex Morgan entered Dock 3", "Access-control log shows Alex entering Dock 3.", "high", "evidence-backed", ["demo-ev-access"]],
  ["18:10:00", "Alex Morgan observed PX-1042", "Employee statement places PX-1042 near Dock 3.", "medium", "evidence-backed", ["demo-ev-statement"]],
  ["18:11:00", "Alex Morgan exited Dock 3", "Access-control log records Alex leaving the dock.", "high", "evidence-backed", ["demo-ev-access"]],
  ["18:13:00", "Sam Carter entered Dock 3", "Access-control log records Sam entering Dock 3.", "high", "evidence-backed", ["demo-ev-access"]],
  ["18:14:00", "Dock 3 CCTV signal interruption", "Security log records a temporary CCTV interruption.", "high", "evidence-backed", ["demo-ev-security"]],
  ["18:17:00", "Sam Carter exited Dock 3", "Access-control log records Sam leaving the dock.", "high", "evidence-backed", ["demo-ev-access"]],
  ["18:19:00", "Vehicle 17 departed loading area", "Dispatch records place vehicle departure at 18:19.", "high", "evidence-backed", ["demo-ev-access", "demo-ev-dispatch"]],
  ["18:21:00", "PX-1042 reported missing from vehicle", "Dispatch supervisor reported that the package was not present in Vehicle 17.", "high", "evidence-backed", ["demo-ev-security", "demo-ev-dispatch"]],
  ["18:26:00", "Manual search initiated", "Security began a manual search after the package could not be located.", "high", "evidence-backed", ["demo-ev-security"]],
].map(([time, title, description, confidence, label, sources], index) => ({ id: `demo-event-${index + 1}`, time, date: "12 Sep 2026", title, description, confidence: confidence as TimelineEvent["confidence"], label: label as TimelineEvent["label"], sources: sources as string[], contradiction: index === 1 || index === 9 ? "demo-con-1" : undefined }));

events.forEach((event, index) => { event.id = `demo-ev-${index + 1}`; });

const contradictions: Contradiction[] = [
  { id: "demo-con-1", code: "CON-001", title: "Discrepancy in package loading status", sourceA: { evidenceId: "demo-ev-security", label: "Security log: PX-1042 marked loaded", time: "18:07" }, sourceB: { evidenceId: "demo-ev-dispatch", label: "Dispatch report: PX-1042 absent from Vehicle 17", time: "18:19" }, issue: "The loading record conflicts with the vehicle departure record.", detail: "One source records PX-1042 as loaded at 18:07, while dispatch confirms it was not present in Vehicle 17 when the vehicle departed at 18:19.", confidence: "high", status: "open", eventIds: ["demo-ev-2", "demo-ev-9", "demo-ev-10"] },
];

const unknowns: Unknown[] = [
  { id: "demo-unknown-1", title: "Current location of package PX-1042", description: "The supplied evidence does not establish where the package went between the loading record and the missing-package report.", window: "18:07–18:26", potentialEvidence: ["CCTV footage", "Dock inventory scan", "Vehicle loading manifest", "Manual search log"], status: "investigating", severity: "high" },
  { id: "demo-unknown-2", title: "Cause of CCTV signal interruption", description: "The reason for the 18:14 CCTV interruption is not established by the supplied sources.", window: "18:14–18:17", potentialEvidence: ["Camera diagnostics", "NVR logs", "Maintenance records", "Additional access records"], status: "open", severity: "medium" },
];

export const DEMO_INVESTIGATION: Investigation = {
  id: "demo-warehouse-package",
  name: "Warehouse Package Disappearance – Dock 3",
  slug: "warehouse-package-disappearance-dock-3",
  status: "complete",
  createdAt: "12 Sep 2026",
  updatedAt: "12 Sep 2026",
  updatedLabel: "Just now",
  incidentDate: "12 Sep 2026",
  description: "Synthetic incident used for the judge presentation demonstrating multimodal evidence correlation and reconstruction.",
  evidenceCount: 4,
  eventCount: events.length,
  contradictionCount: contradictions.length,
  unknownCount: unknowns.length,
  confidence: 86,
  coverage: { verified: 4, uncertain: 0, missing: 0 },
  timelineConfidence: 91,
  requiresReview: 1,
  evidence,
  events,
  contradictions,
  unknowns,
  activity: [
    { time: "Just now", text: "Evidence set correlated", kind: "success" },
    { time: "Just now", text: "Contradiction detected in loading status", kind: "warn" },
    { time: "Just now", text: "Two evidence gaps surfaced for review", kind: "warn" },
  ],
};
