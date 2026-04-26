"use client";

import { useState } from "react";

const ENDPOINTS = [
  {
    id: "get-providers",
    category: "Models",
    name: "List Providers",
    method: "GET",
    path: "/api/v1/providers",
    description: "Retrieve a list of all available AI model providers supported by Basktre, including their unique tags and real-time pricing per 1 million tokens.",
    headers: [],
    params: [],
    code: `curl --location 'https://api.basktre.in/api/v1/providers'`,
    response: {
      "data": [
        {
          "name": "DeepSeek-V4-Flash",
          "tag": "deepseek-v4-flash",
          "input_cost_per_1m": 0.14,
          "output_cost_per_1m": 0.28
        },
        {
          "name": "gpt-4o",
          "tag": "gpt-4o",
          "input_cost_per_1m": 2.5,
          "output_cost_per_1m": 10
        }
      ],
      "request_id": "e72f7c4b1af94ee1afc1a804dd40bb26",
      "success": true
    }
  },
  {
    id: "model-call",
    category: "Models",
    name: "Model Call",
    method: "POST",
    path: "/api/v1/models/call",
    description: "Execute a standard non-streaming request to any supported AI model. You can specify a particular model tag or use 'auto' to let Basktre route your request to the most cost-effective model that meets your performance needs.",
    headers: [
      { name: "api-key", required: true, description: "Your Basktre API key." },
      { name: "Content-Type", required: true, description: "application/json" }
    ],
    params: [
      { name: "model", type: "string", required: true, description: "The unique tag of the model to use (e.g., 'gpt-4o') or 'auto' for intelligent routing." },
      { name: "messages", type: "array", required: true, description: "An array of message objects representing the conversation history. Each message must have a 'role' (one of: 'system', 'user', 'assistant', 'tool') and 'content' (string)." },
      { name: "max_tokens", type: "number", required: false, description: "The maximum number of tokens to generate in the completion." },
      { name: "temperature", type: "number", required: false, description: "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random." },
      { name: "top_p", type: "number", required: false, description: "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass." },
      { name: "stop", type: "array", required: false, description: "Up to 4 sequences where the API will stop generating further tokens." }
    ],
    code: `curl --location 'https://api.basktre.in/api/v1/models/call' \\
--header 'api-key: <YOUR_API_KEY>' \\
--header 'Content-Type: application/json' \\
--data '{
  "model": "deepseek-v4-flash",
  "messages": [
    { "role": "system", "content": "You are a helpful AI assistant." },
    { "role": "user", "content": "how to plan a road trip" }
  ],
  "max_tokens": 300,
  "temperature": 0.7
}'`,
    response: {
      "data": {
        "request_id": "36a70b2591f3670581b9d9ad4cce85fd",
        "model": "deepseek-v4-flash",
        "content": "Planning a road trip can be an exciting adventure...",
        "finish_reason": "stop",
        "usage": {
          "prompt_tokens": 17,
          "completion_tokens": 1070,
          "total_tokens": 1087
        }
      },
      "request_id": "36a70b2591f3670581b9d9ad4cce85fd",
      "success": true
    }
  },
  {
    id: "model-stream",
    category: "Models",
    name: "Model Stream",
    method: "POST",
    path: "/api/v1/models/stream",
    description: "Execute a streaming request to an AI model. The API will return a stream of Server-Sent Events (SSE) containing partial message deltas as they are generated.",
    headers: [
      { name: "api-key", required: true, description: "Your Basktre API key." },
      { name: "Content-Type", required: true, description: "application/json" }
    ],
    params: [
      { name: "model", type: "string", required: true, description: "The unique tag of the model to use." },
      { name: "messages", type: "array", required: true, description: "An array of message objects representing the conversation history. Each message must have a 'role' (one of: 'system', 'user', 'assistant', 'tool') and 'content' (string)." },
      { name: "max_tokens", type: "number", required: false, description: "Max generation tokens." },
      { name: "metadata", type: "object", required: false, description: "Optional metadata to track requests (e.g., workspace_id, user_id)." }
    ],
    code: `curl --location 'https://api.basktre.in/api/v1/models/stream' \\
--header 'api-key: <YOUR_API_KEY>' \\
--header 'Content-Type: application/json' \\
--data '{
  "model": "claude-sonnet-4-6",
  "messages": [
    { "role": "user", "content": "Explain what an API gateway is in simple terms." }
  ],
  "max_tokens": 300
}'`,
    response: "data: {\"choices\":[{\"delta\":{\"content\":\"API\"}}]}\ndata: {\"choices\":[{\"delta\":{\"content\":\" Gateway\"}}]}\n..."
  }
];

export default function DocsContent() {
  const [activeTabMap, setActiveTabMap] = useState<Record<string, string>>(
    Object.fromEntries(ENDPOINTS.map(e => [e.id, "code"]))
  );
  const [activeSection, setActiveSection] = useState(ENDPOINTS[0].id);

  const methodColors: Record<string, string> = {
    GET: "#10b981",
    POST: "#3b82f6",
    PUT: "#f59e0b",
    DELETE: "#ef4444"
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* ── Sidebar ── */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-3)] font-semibold mb-3 px-2">
              Introduction
            </h3>
            <a
              href="#getting-started"
              className="block px-2 py-1.5 text-[13px] text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
            >
              Getting Started
            </a>
            <a
              href="#authentication"
              className="block px-2 py-1.5 text-[13px] text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
            >
              Authentication
            </a>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-3)] font-semibold mb-3 px-2">
              Models
            </h3>
            <div className="space-y-1">
              {ENDPOINTS.map((endpoint) => (
                <a
                  key={endpoint.id}
                  href={`#${endpoint.id}`}
                  onClick={() => setActiveSection(endpoint.id)}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] transition-all ${
                    activeSection === endpoint.id
                      ? "bg-[var(--surface-hover)] text-[var(--text)] font-medium"
                      : "text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: methodColors[endpoint.method] }}
                  />
                  {endpoint.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 max-w-4xl space-y-24 pb-24">
        {/* Getting Started */}
        <section id="getting-started" className="space-y-4">
          <h1 className="text-4xl font-semibold text-[var(--text)] tracking-tight">API Reference</h1>
          <p className="text-[var(--text-2)] text-lg leading-relaxed">
            Everything you need to integrate Basktre into your application. Use one API key to access the world&apos;s best AI models with built-in cost optimization.
          </p>
          <div className="p-5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] mt-8">
            <span className="text-xs font-mono text-[var(--text-3)] block mb-2 uppercase tracking-wide">Base URL</span>
            <code className="text-base font-mono text-[var(--accent)] font-semibold">https://api.basktre.in</code>
          </div>
        </section>

        {/* Authentication */}
        <section id="authentication" className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--text)]">Authentication</h2>
          <p className="text-[var(--text-2)] leading-relaxed">
            Most API requests must be authenticated using your Basktre API key. You can view and manage your API keys in the <a href="/dashboard/api-keys" className="text-[var(--accent)] hover:underline">Dashboard</a>. Some endpoints, like listing providers, are public and do not require an API key.
          </p>
          <div className="bg-[#1c1c1c] rounded-xl p-5 font-mono text-sm overflow-x-auto border border-white/5 shadow-lg">
            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-3">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="ml-2 text-white/20 text-[11px] uppercase tracking-wider">Header Example</span>
            </div>
            <span className="text-white/40">api-key: </span>
            <span className="text-[#86efac]">bk_live_xxxxxxxxxxxxxxxxxxxxxxxx</span>
          </div>
        </section>

        {/* Endpoints */}
        {ENDPOINTS.map((endpoint) => (
          <section key={endpoint.id} id={endpoint.id} className="space-y-8 pt-8">
            <div className="border-b border-[var(--border)] pb-6">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider text-white uppercase"
                  style={{ backgroundColor: methodColors[endpoint.method] }}
                >
                  {endpoint.method}
                </span>
                <code className="text-[13px] font-mono text-[var(--text-3)] bg-[var(--surface-hover)] px-3 py-1 rounded-full border border-[var(--border)]">
                  {endpoint.path}
                </code>
              </div>
              <h2 className="text-2xl font-semibold text-[var(--text)]">{endpoint.name}</h2>
              <p className="text-[var(--text-2)] leading-relaxed mt-4 max-w-2xl">{endpoint.description}</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-8">
              {/* Left: Params & Details */}
              <div className="space-y-10">
                {endpoint.headers.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.1em] mb-5">Headers</h3>
                    <div className="space-y-4">
                      {endpoint.headers.map((h) => (
                        <div key={h.name} className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <code className="text-[13px] text-[var(--accent)] font-semibold">{h.name}</code>
                            {h.required && <span className="text-[9px] text-red-500 font-bold uppercase tracking-tighter">Required</span>}
                          </div>
                          <p className="text-[12px] text-[var(--text-3)] leading-snug">{h.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {endpoint.params.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.1em] mb-5">Body Parameters</h3>
                    <div className="space-y-6">
                      {endpoint.params.map((p) => (
                        <div key={p.name} className="relative pl-4 border-l-2 border-[var(--border)] py-1">
                          <div className="flex items-center gap-3 mb-1.5">
                            <code className="text-[13px] text-[var(--text)] font-bold">{p.name}</code>
                            <span className="text-[11px] text-[var(--text-3)] font-mono opacity-80">{p.type}</span>
                            {p.required && <span className="text-[9px] text-red-400 font-bold uppercase tracking-tighter">Required</span>}
                          </div>
                          <p className="text-[12px] text-[var(--text-2)] leading-relaxed">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Code & Response Tabs */}
              <div className="bg-[#1c1c1c] rounded-2xl overflow-hidden border border-white/5 flex flex-col h-fit shadow-2xl sticky top-24">
                <div className="flex items-center gap-1 p-2 bg-white/5 border-b border-white/5">
                  {["code", "response"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTabMap(prev => ({ ...prev, [endpoint.id]: tab }))}
                      className={`px-4 py-2 rounded-lg text-[11px] font-semibold transition-all ${
                        activeTabMap[endpoint.id] === tab
                          ? "bg-white/10 text-white shadow-sm"
                          : "text-white/40 hover:text-white/60"
                      }`}
                    >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                  <button
                    onClick={() => copyToClipboard(activeTabMap[endpoint.id] === "code" ? endpoint.code : JSON.stringify(endpoint.response, null, 2))}
                    className="ml-auto p-2 text-white/30 hover:text-white/60 transition-colors"
                    title="Copy to clipboard"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>

                <div className="p-6 overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-white/10">
                  {activeTabMap[endpoint.id] === "code" ? (
                    <pre className="font-mono text-[13px] text-[#e5e7eb] leading-relaxed whitespace-pre-wrap">
                      {endpoint.code}
                    </pre>
                  ) : (
                    <pre className="font-mono text-[13px] text-[#86efac] leading-relaxed whitespace-pre">
                      {typeof endpoint.response === "string" 
                        ? endpoint.response 
                        : JSON.stringify(endpoint.response, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
