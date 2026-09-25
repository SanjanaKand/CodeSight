from fastapi import APIRouter, HTTPException

from ..models.schemas import CodeRequest, ExecutionSnapshot
from ..services.tracer import trace_execution


router = APIRouter(
    prefix="/api",
    tags=["Tracer"]
)


@router.post(
    "/trace",
    response_model=list[ExecutionSnapshot]
)
def trace_code_endpoint(request: CodeRequest):

    try:
        snapshots = trace_execution(
            request.code,
            request.language
        )

        return snapshots

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        )