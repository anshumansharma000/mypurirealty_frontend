"use client";

import { login } from "@/features/auth/api/login";
import { setTokens } from "@/shared/auth/token";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setIsSubmitting(true);

    const emailValue = email.trim();
    const passwordValue = password.trim();

    if (!emailValue || !passwordValue) {
      setErr("Email and password are required");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login({ email: emailValue, password: passwordValue });
      setTokens(result.tokens);
      document.cookie = `admin_auth=1; path=/; SameSite=Lax`;
      router.replace("/admin");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign in";
      setErr(message);
    } finally {
      // allow button to re-enable if navigation is blocked for any reason
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 h-10 w-10 rounded-2xl bg-gray-900" />
          <h1 className="text-2xl font-semibold tracking-tight">
            mypurirealty <span className="text-gray-400">/ admin</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to continue</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mypurirealty.com"
              className="w-full rounded-xl border px-3 py-2 outline-none ring-0 focus:border-gray-900"
            />
          </div>

          <div className="mb-1">
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
                className="w-full rounded-xl border px-3 py-2 pr-10 outline-none ring-0 focus:border-gray-900"
              />
              <button
                type="button"
                aria-label={showPw ? "Hide password" : "Show password"}
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {err && <p className="mb-3 text-sm text-red-600">{err}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !email || !password}
            className="w-full rounded-xl bg-black px-4 py-2 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
