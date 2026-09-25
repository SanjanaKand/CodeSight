from pydantic import BaseModel
from typing import List, Dict, Any

class CodeRequest(BaseModel):
    code: str
    language: str

class Position(BaseModel):
    row: int
    column: int

class FunctionDetail(BaseModel):
    name: str
    node_type: str
    start: Position
    end: Position

class ParseResponse(BaseModel):
    language: str
    syntax_tree_type: str
    has_syntax_errors: bool
    functions_found: List[str]
    function_details: List[FunctionDetail]
    classes_found: List[str]
    class_details: List[FunctionDetail]

class LanguagesResponse(BaseModel):
    supported_languages: List[str]
    total_supported: int

class VariableState(BaseModel):
    type: str
    value: Any

class StackFrame(BaseModel):
    functionName: str
    line: int

class ExecutionSnapshot(BaseModel):
    stepIndex: int
    line: int
    event: str  # e.g., 'line', 'call', 'return', 'exception'
    variables: Dict[str, VariableState]
    callStack: List[StackFrame]
    stdout: List[str]
    errorType: str | None = None
    errorMessage: str | None = None