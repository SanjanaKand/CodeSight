const API_BASE_URL = "http://127.0.0.1:8000";

export interface ParseRequest {
  code: string;
  language: string;
}

export interface Position {
  row: number;
  column: number;
}

export interface FunctionDetail {
  name: string;
  node_type: string;
  start: Position;
  end: Position;
}

export interface ParseResponse {
  language: string;
  syntax_tree_type: string;
  has_syntax_errors: boolean;
  functions_found: string[];
  function_details: FunctionDetail[];
  classes_found: string[];
  class_details: FunctionDetail[];
}

export interface ExecutionSnapshot {
  stepIndex: number;
  line: number;
  event: string;
  variables: Record<
    string,
    {
      type: string;
      value: unknown;
    }
  >;
  callStack: Array<{
    functionName: string;
    line: number;
  }>;
  stdout: string[];
  errorType: string | null;
  errorMessage: string | null;
}

export async function parseCode(
  request: ParseRequest
): Promise<ParseResponse> {
  const response = await fetch(`${API_BASE_URL}/api/parse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Parser request failed");
  }

  return response.json();
}

export async function traceCode(
  request: ParseRequest
): Promise<ExecutionSnapshot[]> {
  const response = await fetch(`${API_BASE_URL}/api/trace`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Trace request failed");
  }

  return response.json();
}