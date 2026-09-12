import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { Button, Field, Input } from "../../components/ui";
import { cn } from "../../lib/cn";
import { useApp } from "../../store/AppContext";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..4
}

export default function SignUp() {
  const { signUp } = useApp();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const s = useMemo(() => strength(password), [password]);
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  const mismatch = confirm.length > 0 && confirm !== password;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mismatch || s < 2) {
      setStatus("error");
      setError(mismatch ? "Passwords don't match." : "Choose a stronger password.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      await signUp(name, email, password);
      setStatus("success");
      setTimeout(() => nav("/app/dashboard"), 600);
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Set up a workspace and start reconstructing incidents.">
      <form onSubmit={submit} className="space-y-4">
        {status === "error" && (
          <div className="flex items-start gap-2 rounded-sm border border-crimson/30 bg-crimson/10 px-3 py-2.5 text-sm text-crimson">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center gap-2 rounded-sm border border-verified/30 bg-verified/10 px-3 py-2.5 text-sm text-verified">
            <CheckCircle2 className="size-4" /> Account created — setting up your workspace…
          </div>
        )}
        <Field label="Full name">
          <Input required autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Dana Whitfield" />
        </Field>
        <Field label="Email">
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@fieldoffice.gov" />
        </Field>
        <Field label="Password">
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          {password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      i < s ? (s <= 1 ? "bg-crimson" : s === 2 ? "bg-amber" : s === 3 ? "bg-accent" : "bg-verified") : "bg-surface-3",
                    )}
                  />
                ))}
              </div>
              <span className="mt-1 block text-xs text-fg-dim">{labels[s]}</span>
            </div>
          )}
        </Field>
        <Field label="Confirm password" error={mismatch ? "Passwords don't match." : undefined}>
          <Input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
        </Field>
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={status === "loading"}>
          Create account
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-fg-dim">
        Already have an account? <Link to="/sign-in" className="text-accent hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
