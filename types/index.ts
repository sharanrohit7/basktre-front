export interface WaitlistRequest {
  email: string;
}

export interface WaitlistResponse {
  message: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NavLink {
  label: string;
  href: string;
}

// ─── Auth ────────────────────────────────────────────

export interface GoogleLoginRequest {
  email: string;
  name: string;
  google_id: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  google_id: string;
  status: string;
}

export interface GoogleLoginResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null; // Google ID token for authenticated requests
  isAuthenticated: boolean;
}

// ─── Workspace ───────────────────────────────────────

export interface CreateWorkspaceRequest {
  workspace_code: string;
  workspace_name: string;
}

export interface Workspace {
  id: number;
  workspace_code: string;
  name: string;
  status: string;
}

export interface CreateWorkspaceResponse {
  success: boolean;
  data: {
    workspace: Workspace;
  };
}

// ─── API Keys ────────────────────────────────────────

export interface CreateApiKeyRequest {
  name: string;
}

export interface ApiKeyResponse {
  success: boolean;
  data: {
    token: string;
  };
}

export interface ApiKey {
  id: number;
  workspace_id: number;
  key_name: string;
  prefix: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKeyListResponse {
  success: boolean;
  data: {
    api_keys: ApiKey[];
  };
}

export interface ApiKeyDeleteResponse {
  success: boolean;
  message?: string;
}

// ─── Providers ───────────────────────────────────────

export interface Provider {
  name: string;
  tag: string;
  input_cost_per_1m: number;
  output_cost_per_1m: number;
}

export interface ProvidersResponse {
  success: boolean;
  data: Provider[];
}

// ─── Toast ───────────────────────────────────────────

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// ─── Analytics & Usage ───────────────────────────────

export interface WorkspaceUsage {
  id: number;
  created_at: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  model_tag: string;
  cost: number;
  status: string;
}

export interface DailyUsage {
  date: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_cost: number;
}

// ─── Wallet & Transactions ───────────────────────────

export interface WorkspaceWallet {
  id: number;
  workspace_id: number;
  balance: number;
  currency: string;
  credit_limit: number;
  status: string;
}

export interface WalletTransaction {
  id: number;
  wallet_id: number;
  amount: number;
  transaction_type: string;
  reference_id: string;
  description: string;
  created_at: string;
}

export interface WorkspaceListResponse {
  success: boolean;
  data: {
    workspaces: Workspace[];
  };
}

export interface WorkspaceUsageResponse {
  success: boolean;
  data: {
    usage: WorkspaceUsage[];
  };
}

export interface DailyUsageResponse {
  success: boolean;
  data: {
    daily_usage: DailyUsage[];
  };
}

export interface WalletResponse {
  success: boolean;
  data: {
    wallet: WorkspaceWallet;
  };
}

export interface TransactionsResponse {
  success: boolean;
  data: {
    transactions: WalletTransaction[];
  };
}

export interface ModelInfo {
  id: string;
  name: string;
  context_limit?: number;
  type?: string;
}

export interface GetModelsResponse {
  success: boolean;
  data: {
    provider: string;
    models: ModelInfo[];
  };
}
