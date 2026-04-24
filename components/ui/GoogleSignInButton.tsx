"use client";

import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { env } from "@/config/env";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "@/components/ui/Spinner";

function decodeJwtPayload(token: string): Record<string, string> {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

function GoogleSignInInner({ label }: { label?: string }) {
  const { login } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSuccess(response: CredentialResponse) {
    const idToken = response.credential;
    if (!idToken) {
      addToast("error", "Google sign-in failed: no credential received.");
      return;
    }

    const payload = decodeJwtPayload(idToken);
    const email = payload.email ?? "";
    const name = payload.name ?? "";
    const sub = payload.sub ?? "";

    if (!email || !sub) {
      addToast("error", "Could not extract user info from Google token.");
      return;
    }

    setLoading(true);
    try {
      await login(idToken, email, name, sub);
      addToast("success", `Welcome, ${name || email}!`);
      router.push("/dashboard");
    } catch (err) {
      addToast("error", err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleError() {
    addToast("error", "Google sign-in was cancelled or failed.");
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "12px 24px",
          borderRadius: "var(--radius-sm)",
          background: "var(--ink)",
          color: "white",
          fontSize: 14,
          fontWeight: 500
        }}
      >
        <Spinner size="sm" white />
        Signing in...
      </div>
    );
  }

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text={label === "signin" ? "signin_with" : "continue_with"}
        shape="rectangular"
        theme="outline"
        size="large"
        width="300"
      />
    </div>
  );
}

export default function GoogleSignInButton({ label }: { label?: string }) {
  const clientId = env.googleClientId;

  if (!clientId) {
    return (
      <div
        style={{
          padding: "12px 20px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
          color: "var(--text-3)",
          fontSize: 13,
          textAlign: "center"
        }}
      >
        Google sign-in not configured (missing NEXT_PUBLIC_GOOGLE_CLIENT_ID)
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleSignInInner label={label} />
    </GoogleOAuthProvider>
  );
}
