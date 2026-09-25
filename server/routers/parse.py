from fastapi import APIRouter, HTTPException

from ..models.schemas import CodeRequest, ParseResponse
from ..services.tree_sitter_engine import execute_parse


router = APIRouter(
    prefix="/api",
    tags=["Parser"]
)


@router.post(
    "/parse",
    response_model=ParseResponse
)
def parse_code_endpoint(request: CodeRequest):
    """
    Receives code and language, then returns parsed AST structure.
    """
    try:
        result = execute_parse(
            request.code,
            request.language
        )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )