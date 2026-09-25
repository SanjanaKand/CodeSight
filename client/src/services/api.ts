const API_BASE_URL = 'http://127.0.0.1:8000'

export interface ParseRequest {
  code: string
  language: string
}

export interface Position {
  row: number
  column: number
}

export interface FunctionDetail {
  name: string
  node_type: string
  start: Position
  end: Position
}

export interface ParseResponse {
  language: string
  syntax_tree_type: string
  has_syntax_errors: boolean
  functions_found: string[]
  function_details: FunctionDetail[]
  classes_found: string[]
  class_details: FunctionDetail[]
}

export async function parseCode(
  request: ParseRequest,
): Promise<ParseResponse> {
  const response = await fetch(`${API_BASE_URL}/api/parse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Parser request failed')
  }

  return response.json()
}