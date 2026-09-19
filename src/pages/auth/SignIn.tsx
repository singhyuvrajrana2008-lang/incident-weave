import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Button, Field, Input } from "../../components/ui";
import { useApp } from "../../store/AppContext";

export default function SignIn() {
  const { signIn } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await signIn(email, password);
      setStatus("success");
      setTimeout(() => nav("/app/dashboard"), 500);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error && err.message === "network"
        ? "Network error — couldn't reach the server. Check your connection and retry."
        : (err as Error).message);
    }
  }

  return (
    <AuthLayout title="Sign in to IncidentWeave" subtitle="Access your investigation workspace.">
      <form onSubmit={submit} className="space-y-4">
        {status === "error" && (
          <div className="flex items-start gap-2 rounded-sm border border-crimson/30 bg-crimson/10 px-3 py-2.5 text-sm text-crimson">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center gap-2 rounded-sm border border-verified/30 bg-verified/10 px-3 py-2.5 text-sm text-verified">
            <CheckCircle2 className="size-4" /> Signed in — opening your workspace…
          </div>
        )}
        <Field label="Email">
          <Input type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@fieldoffice.gov" className="font-semibold text-fg" />
        </Field>
        <Field label="Password" hint={<Link to="/forgot-password" className="text-accent hover:underline">Forgot password?</Link> as unknown as string}>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </Field>
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={status === "loading"}>
          Sign in
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-fg-dim">
        Don't have an account? <Link to="/sign-up" className="text-accent hover:underline">Create account</Link>
      </p>
      <p className="mt-3 rounded-sm border border-line bg-surface px-3 py-2 text-center text-xs text-fg-faint">
        Demo: any valid email + 4+ char password. Try <span className="font-mono text-fg-dim">network@fail.com</span> to see the error state.
      </p>
    </AuthLayout>
  );
}
