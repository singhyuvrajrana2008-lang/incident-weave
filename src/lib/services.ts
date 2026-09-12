import { investigations as seedInvestigations, notifications as seedNotifications } from "./data";
import type { Investigation, AppNotification } from "./types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

export interface Session {
  id: string;
  name: string;
  email: string;
  role: string;
  workspace: string;
  createdAt: string;
}

const SESSION_KEY = "iw_session";

export const authService = {
  current(): Session | null {
    try { const raw = localStorage.getItem(SESSION_KEY); return raw ? (JSON.parse(raw) as Session) : null; } catch { return null; }
  },
  async signIn(email: string, password: string): Promise<Session> {
    await wait(900);
    if (!email.includes("@") || password.length < 4) throw new Error("Invalid credentials. Check your email and password.");
    if (email === "network@fail.com") throw new Error("network");
    const session: Session = { id: crypto.randomUUID(), name: email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()), email, role: "Investigator", workspace: "", createdAt: today() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session)); return session;
  },
  async signUp(name: string, email: string, _password: string): Promise<Session> {
    await wait(1100);
    if (email === "taken@iw.com") throw new Error("An account with this email already exists.");
    const session: Session = { id: crypto.randomUUID(), name, email, role: "Investigator", workspace: "", createdAt: today() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session)); return session;
  },
  async resetPassword(email: string): Promise<void> { await wait(1000); if (!email.includes("@")) throw new Error("Enter a valid email address."); if (email === "network@fail.com") throw new Error("network"); },
  async signOut(): Promise<void> { await wait(200); localStorage.removeItem(SESSION_KEY); },
  updateProfile(patch: Partial<Session>) { const cur = this.current(); if (!cur) return; localStorage.setItem(SESSION_KEY, JSON.stringify({ ...cur, ...patch })); },
};

export const investigationService = {
  async list(): Promise<Investigation[]> { await wait(500); return seedInvestigations; },
  async get(id: string): Promise<Investigation | undefined> { await wait(400); return seedInvestigations.find((i) => i.id === id || i.slug === id); },
  async create(input: { name: string; description: string; incidentDate: string }): Promise<Investigation> {
    await wait(600); const id = "draft-" + Date.now();
    return { id, slug: id, name: input.name, status: "draft", createdAt: "Today", updatedAt: "Today", updatedLabel: "just now", incidentDate: input.incidentDate, description: input.description, evidenceCount: 0, eventCount: 0, contradictionCount: 0, unknownCount: 0, confidence: 0, coverage: { verified: 0, uncertain: 0, missing: 0 }, timelineConfidence: 0, requiresReview: 0, evidence: [], events: [], contradictions: [], unknowns: [], activity: [{ time: "now", text: "Investigation created", kind: "info" }] };
  },
};

export const notificationService = { async list(): Promise<AppNotification[]> { await wait(300); return seedNotifications; } };

export const ANALYSIS_STAGES = [
  { n: "01", label: "Ingesting evidence" }, { n: "02", label: "Normalizing timestamps" }, { n: "03", label: "Correlating sources" }, { n: "04", label: "Reconstructing events" }, { n: "05", label: "Searching for contradictions" }, { n: "06", label: "Identifying unknown evidence" }, { n: "07", label: "Assembling timeline" }, { n: "08", label: "Investigation ready" },
];
