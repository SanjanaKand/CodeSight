from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tree_sitter_python as tspython
from tree_sitter import Language, Parser

app = FastAPI(title="CodeSight Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

@app.get("/")
def read_root():
    return {"message": "CodeSight Backend is running successfully!"}

@app.post("/parse")
def parse_code(request: CodeRequest):
    PY_LANGUAGE = Language(tspython.language())
    parser = Parser(PY_LANGUAGE)
    
    tree = parser.parse(bytes(request.code, "utf8"))
    root_node = tree.root_node
    
    return {
        "syntax_tree_type": root_node.type,
        "start_point": root_node.start_point,
        "end_point": root_node.end_point,
        "sexp": root_node.sexp().decode("utf8")
    }