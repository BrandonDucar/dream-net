import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Folder,
  FileText,
  Play,
  Globe,
  Settings,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API_BASE = (import.meta as any).env?.VITE_API_URL || "";

// Types
type Collection = {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

type Request = {
  id: string;
  collectionId: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  url: string;
  headers: Record<string, string>;
  body: string | null;
  auth: {
    type?: "bearer" | "basic" | "apikey" | "none";
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    apiKeyLocation?: "header" | "query";
  };
  testScript: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

type Environment = {
  id: string;
  name: string;
  variables: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};

type HistoryEntry = {
  id: string;
  requestId: string;
  environmentId: string | null;
  statusCode: number | null;
  durationMs: number;
  requestSnapshot: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: string;
  };
  responseSnapshot: {
    status: number;
    headers: Record<string, string>;
    body: string;
    size?: number;
  };
  testResults: {
    passed: number;
    failed: number;
    logs: string[];
    errors: string[];
  } | null;
  error: string | null;
  createdAt: string;
};

// API hooks
function useCollections() {
  return useQuery({
    queryKey: ["forge", "collections"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/forge/collections`);
      const data = await res.json();
      return data.collections as Collection[];
    },
  });
}

function useRequests(collectionId: string | null) {
  return useQuery({
    queryKey: ["forge", "requests", collectionId],
    queryFn: async () => {
      if (!collectionId) return [];
      const res = await fetch(`${API_BASE}/api/forge/collections/${collectionId}/requests`);
      const data = await res.json();
      return data.requests as Request[];
    },
    enabled: !!collectionId,
  });
}

function useEnvironments() {
  return useQuery({
    queryKey: ["forge", "environments"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/forge/environments`);
      const data = await res.json();
      return data.environments as Environment[];
    },
  });
}

function useRequestHistory(requestId: string | null) {
  return useQuery({
    queryKey: ["forge", "history", requestId],
    queryFn: async () => {
      if (!requestId) return [];
      const res = await fetch(`${API_BASE}/api/forge/requests/${requestId}/history`);
      const data = await res.json();
      return data.history as HistoryEntry[];
    },
    enabled: !!requestId,
  });
}

export default function App() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"params" | "headers" | "body" | "tests">("params");
  const [response, setResponse] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const { data: collections } = useCollections();
  const { data: requests } = useRequests(selectedCollectionId);
  const { data: environments } = useEnvironments();
  const { data: history } = useRequestHistory(selectedRequestId);
  const queryClient = useQueryClient();

  const selectedRequest = requests?.find((r) => r.id === selectedRequestId);
  const selectedEnvironment = environments?.find((e) => e.id === selectedEnvironmentId);

  // Create collection mutation
  const createCollection = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`${API_BASE}/api/forge/collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      return data.collection as Collection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forge", "collections"] });
    },
  });

  // Create request mutation
  const createRequest = useMutation({
    mutationFn: async (data: { collectionId: string; name: string; method: string; url: string }) => {
      const res = await fetch(`${API_BASE}/api/forge/collections/${data.collectionId}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      return json.request as Request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forge", "requests"] });
    },
  });

  // Execute request
  const executeRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await fetch(`${API_BASE}/api/forge/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          environmentId: selectedEnvironmentId,
        }),
      });
      return await res.json();
    },
    onSuccess: (data) => {
      setResponse(data);
      queryClient.invalidateQueries({ queryKey: ["forge", "history"] });
    },
  });

  const handleExecute = async () => {
    if (!selectedRequestId) return;
    setIsExecuting(true);
    try {
      await executeRequest.mutateAsync(selectedRequestId);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Collections & Requests */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">Dream API Forge</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-4">
            <button
              onClick={() => {
                const name = prompt("Collection name:");
                if (name) createCollection.mutate(name);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              <Plus className="h-4 w-4" />
              New Collection
            </button>
          </div>

          {collections?.map((collection) => (
            <div key={collection.id} className="mb-2">
              <button
                onClick={() => {
                  setSelectedCollectionId(collection.id);
                  setSelectedRequestId(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded ${
                  selectedCollectionId === collection.id ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  {collection.name}
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>

              {selectedCollectionId === collection.id && (
                <div className="ml-4 mt-1 space-y-1">
                  <button
                    onClick={() => {
                      const name = prompt("Request name:");
                      const method = prompt("Method (GET/POST/etc):", "GET");
                      const url = prompt("URL:", "https://api.example.com/endpoint");
                      if (name && method && url) {
                        createRequest.mutate({ collectionId: collection.id, name, method, url });
                      }
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
                  >
                    <Plus className="h-3 w-3" />
                    New Request
                  </button>

                  {requests?.map((request) => (
                    <button
                      key={request.id}
                      onClick={() => setSelectedRequestId(request.id)}
                      className={`w-full flex items-center gap-2 px-2 py-1 text-xs rounded ${
                        selectedRequestId === request.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <FileText className="h-3 w-3" />
                      <span className="font-mono text-[10px] mr-1">{request.method}</span>
                      {request.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar - Environment Selector */}
        <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <select
              value={selectedEnvironmentId || ""}
              onChange={(e) => setSelectedEnvironmentId(e.target.value || null)}
              className="px-3 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="">No Environment</option>
              {environments?.map((env) => (
                <option key={env.id} value={env.id}>
                  {env.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                const name = prompt("Environment name:");
                if (name) {
                  fetch(`${API_BASE}/api/forge/environments`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, variables: {} }),
                  }).then(() => {
                    queryClient.invalidateQueries({ queryKey: ["forge", "environments"] });
                  });
                }
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
            >
              <Globe className="h-3 w-3" />
              New Env
            </button>
          </div>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Request Editor & Response Viewer */}
        <div className="flex-1 flex">
          {/* Left: Request Editor */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {selectedRequest ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">{selectedRequest.name}</h2>
                    <button
                      onClick={handleExecute}
                      disabled={isExecuting}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Play className="h-4 w-4" />
                      {isExecuting ? "Sending..." : "Send"}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedRequest.method}
                      className="px-2 py-1 text-sm border border-gray-300 rounded font-mono"
                    >
                      <option>GET</option>
                      <option>POST</option>
                      <option>PUT</option>
                      <option>PATCH</option>
                      <option>DELETE</option>
                      <option>HEAD</option>
                      <option>OPTIONS</option>
                    </select>
                    <input
                      type="text"
                      value={selectedRequest.url}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded"
                      placeholder="https://api.example.com/endpoint"
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  {(["params", "headers", "body", "tests"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm capitalize ${
                        activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {activeTab === "params" && (
                    <div className="text-sm text-gray-600">
                      <p>URL parameters can be added directly in the URL above.</p>
                      {selectedEnvironment && (
                        <div className="mt-4">
                          <p className="font-semibold mb-2">Environment Variables:</p>
                          <div className="space-y-1">
                            {Object.entries(selectedEnvironment.variables).map(([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <span className="font-mono text-xs">{key}:</span>
                                <span className="text-xs">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "headers" && (
                    <div className="space-y-2">
                      {Object.entries(selectedRequest.headers || {}).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <input
                            type="text"
                            value={key}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="Header name"
                          />
                          <input
                            type="text"
                            value={value}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="Header value"
                          />
                        </div>
                      ))}
                      <button className="text-xs text-blue-600">+ Add Header</button>
                    </div>
                  )}

                  {activeTab === "body" && (
                    <textarea
                      value={selectedRequest.body || ""}
                      className="w-full h-full p-2 font-mono text-sm border border-gray-300 rounded"
                      placeholder='{"key": "value"}'
                    />
                  )}

                  {activeTab === "tests" && (
                    <textarea
                      value={selectedRequest.testScript || ""}
                      className="w-full h-full p-2 font-mono text-sm border border-gray-300 rounded"
                      placeholder="forge.expectStatus(200);&#10;forge.expectBodyContains('success');"
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a request to edit
              </div>
            )}
          </div>

          {/* Right: Response Viewer */}
          <div className="w-1/2 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Response</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {response ? (
                <div className="space-y-4">
                  {/* Status & Duration */}
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        response.response?.status >= 200 && response.response?.status < 300
                          ? "bg-green-100 text-green-700"
                          : response.response?.status >= 400
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {response.response?.status || "Error"}
                    </span>
                    <span className="text-sm text-gray-600">{response.response?.durationMs}ms</span>
                    {response.response?.size && (
                      <span className="text-sm text-gray-600">{(response.response.size / 1024).toFixed(2)} KB</span>
                    )}
                  </div>

                  {/* Test Results */}
                  {response.testResults && (
                    <div className="border border-gray-200 rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Tests</span>
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          {response.testResults.passed}
                        </span>
                        <span className="text-red-600 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {response.testResults.failed}
                        </span>
                      </div>
                      {response.testResults.logs.length > 0 && (
                        <div className="text-xs text-gray-600 space-y-1">
                          {response.testResults.logs.map((log: string, i: number) => (
                            <div key={i}>{log}</div>
                          ))}
                        </div>
                      )}
                      {response.testResults.errors.length > 0 && (
                        <div className="text-xs text-red-600 space-y-1 mt-2">
                          {response.testResults.errors.map((err: string, i: number) => (
                            <div key={i}>{err}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Response Body */}
                  <div>
                    <h4 className="font-semibold mb-2">Body</h4>
                    <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-96">
                      {typeof response.response?.body === "string"
                        ? response.response.body
                        : JSON.stringify(response.response?.body, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center">No response yet. Send a request to see results.</div>
              )}
            </div>

            {/* History Sidebar */}
            {selectedRequestId && (
              <div className="h-48 border-t border-gray-200 overflow-y-auto p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  History
                </h4>
                <div className="space-y-2">
                  {history?.slice(0, 5).map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setResponse({ response: entry.responseSnapshot, testResults: entry.testResults })}
                      className="w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded flex items-center justify-between"
                    >
                      <span>{new Date(entry.createdAt).toLocaleTimeString()}</span>
                      <span
                        className={`px-2 py-0.5 rounded ${
                          entry.statusCode && entry.statusCode >= 200 && entry.statusCode < 300
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {entry.statusCode || "Error"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

