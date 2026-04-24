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
  GetModelsResponse
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
    throw new Error(error?.message ?? `Request failed: ${response.status}`);
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

export async function googleLogin(
  email: string,
  name: string,
  googleId: string
): Promise<GoogleLoginResponse> {
  return request<GoogleLoginResponse>("/auth/google-login", {
    method: "POST",
    body: JSON.stringify({ email, name, google_id: googleId })
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
  workspaceName: string
): Promise<CreateWorkspaceResponse> {
  return request<CreateWorkspaceResponse>("/workspace", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      workspace_code: workspaceCode,
      workspace_name: workspaceName
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
    body: JSON.stringify(updates)
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
