import { env } from "@/config/env";
import type {
  WaitlistResponse,
  GoogleLoginResponse,
  CreateWorkspaceResponse,
  ApiKeyResponse,
  ApiKeyListResponse,
  ApiKeyDeleteResponse,
  ProvidersResponse,
  WorkspaceListResponse,
  WorkspaceUsageResponse,
  DailyUsageResponse,
  TransactionsResponse,
  WalletResponse,
  GetModelsResponse,
  BYOKCredentialsResponse,
  BYOKCredentialResponse
} from "@/types";

/** Resolve at call time so NEXT_PUBLIC_* is inlined correctly in the client bundle. */
function apiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";
  }
  return env.apiBaseUrl;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = apiBaseUrl().replace(/\/$/, "");
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    console.debug("[basktre:api] fetch", options.method ?? "GET", url);
  }

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      console.debug("[basktre:api] error", response.status, error);
    }
    throw new Error(error?.error?.message ?? error?.message ?? `Request failed: ${response.status}`);
  }

  return response.json();
}

// ─── Waitlist ────────────────────────────────────────

export async function joinWaitlist(email: string): Promise<WaitlistResponse> {
  return request<WaitlistResponse>("/waitlist", {
    method: "POST",
    body: JSON.stringify({ email })
  });
}

// ─── Auth ────────────────────────────────────────────

export async function googleLogin(googleIdToken: string): Promise<GoogleLoginResponse> {
  return request<GoogleLoginResponse>("/auth/google-login", {
    method: "POST",
    headers: { Authorization: `Bearer ${googleIdToken}` }
  });
}

// ─── Providers ───────────────────────────────────────

export async function listProviders(): Promise<ProvidersResponse> {
  return request<ProvidersResponse>("/providers", { method: "GET" });
}

export async function getModels(token: string, providerTag: string): Promise<GetModelsResponse> {
  return request<GetModelsResponse>(`/models/list?tag=${providerTag}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

// ─── Workspace ───────────────────────────────────────

export async function createWorkspace(
  token: string,
  workspaceCode: string,
  workspaceName: string,
  inferenceMode: "managed" | "byok"
): Promise<CreateWorkspaceResponse> {
  return request<CreateWorkspaceResponse>("/workspace", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      workspace_code: workspaceCode,
      workspace_name: workspaceName,
      inference_mode: inferenceMode
    })
  });
}

// ─── API Keys ────────────────────────────────────────

export async function createApiKey(
  token: string,
  workspaceId: number,
  name: string
): Promise<ApiKeyResponse> {
  return request<ApiKeyResponse>(`/workspace/${workspaceId}/api-key`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name })
  });
}

export async function getApiKeys(
  token: string,
  workspaceId: number
): Promise<ApiKeyListResponse> {
  return request<ApiKeyListResponse>(`/workspace/${workspaceId}/api-key`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function revokeApiKey(
  token: string,
  workspaceId: number,
  keyId: number
): Promise<ApiKeyDeleteResponse> {
  return request<ApiKeyDeleteResponse>(`/workspace/${workspaceId}/api-key/${keyId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
}

// ─── Workspace Expanded ──────────────────────────────

export async function getWorkspacesByUser(token: string, userId: number): Promise<WorkspaceListResponse> {
  return request<WorkspaceListResponse>(`/workspace/user/${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function updateWorkspace(
  token: string,
  workspaceId: number,
  updates: { name?: string; rate_limit_per_min?: number; monthly_token_limit?: number }
): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/workspace/${workspaceId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      workspace_name: updates.name,
      rate_limit_per_min: updates.rate_limit_per_min,
      monthly_token_limit: updates.monthly_token_limit
    })
  });
}

// ─── BYOK Credentials ───────────────────────────────

export async function getBYOKCredentials(token: string, workspaceId: number): Promise<BYOKCredentialsResponse> {
  return request<BYOKCredentialsResponse>(`/workspace/${workspaceId}/byok/credentials`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function upsertBYOKCredential(
  token: string,
  workspaceId: number,
  provider: string,
  apiKey: string,
  name?: string
): Promise<BYOKCredentialResponse> {
  return request<BYOKCredentialResponse>(`/workspace/${workspaceId}/byok/credentials/${provider}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ api_key: apiKey, name: name || undefined })
  });
}

export async function deleteBYOKCredential(token: string, workspaceId: number, provider: string): Promise<void> {
  await request(`/workspace/${workspaceId}/byok/credentials/${provider}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function deleteWorkspace(token: string, workspaceId: number): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/workspace/${workspaceId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
}

// ─── Analytics & Usage ───────────────────────────────

export async function getWorkspaceUsage(token: string, workspaceId: number): Promise<WorkspaceUsageResponse> {
  return request<WorkspaceUsageResponse>(`/dashboard/workspace/${workspaceId}/usage`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getDailyUsage(token: string, workspaceId: number): Promise<DailyUsageResponse> {
  return request<DailyUsageResponse>(`/dashboard/workspace/${workspaceId}/usage/daily`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getWalletTransactions(token: string, workspaceId: number): Promise<TransactionsResponse> {
  return request<TransactionsResponse>(`/dashboard/workspace/${workspaceId}/transactions`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}

// ─── Wallet ──────────────────────────────────────────

export async function getWallet(token: string, workspaceId: number): Promise<WalletResponse> {
  return request<WalletResponse>(`/wallet/${workspaceId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
}
