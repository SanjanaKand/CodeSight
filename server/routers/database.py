from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from server.database import get_db

router = APIRouter(
    prefix="/api",
    tags=["Database"]
)


@router.get("/db-health")
def database_health(db: Session = Depends(get_db)):
    try:
        result = db.execute(
            text("SELECT DATABASE()")
        ).scalar()

        return {
            "status": "connected",
            "database": result,
            "message": "FastAPI is connected to MySQL successfully!"
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
