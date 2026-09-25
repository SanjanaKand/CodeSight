from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.routers.parse import router as parse_router
from server.routers.trace import router as trace_router


app = FastAPI(
    title="CodeSight Backend"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(trace_router)
app.include_router(parse_router)


@app.get("/")
def read_root():
    return {
        "message": "CodeSight Modular Backend is running successfully!"
    }