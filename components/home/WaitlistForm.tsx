"use client";

import { useState } from "react";
import { joinWaitlist } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit() {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      await joinWaitlist(email);
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto flex max-w-[440px] items-center justify-center gap-2 rounded-lg border border-[rgba(26,107,74,0.2)] bg-[var(--accent-light)] px-5 py-3.5 text-sm font-medium text-[var(--accent)]">
        You&apos;re on the list - we&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto flex max-w-[440px] gap-2">
        <input
          type="email"
          value={email}
          disabled={status === "loading"}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 rounded-lg border border-[var(--border-dark)] bg-[var(--bg)] px-4 py-2.5 text-sm outline-none"
        />
        <button
          disabled={status === "loading"}
          onClick={submit}
          className="rounded-[7px] bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {status === "loading" ? "Joining..." : "Join waitlist"}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
      <p className="mt-3 text-xs text-[var(--text-3)]">No spam. Just an invite when your spot is ready.</p>
    </>
  );
}
