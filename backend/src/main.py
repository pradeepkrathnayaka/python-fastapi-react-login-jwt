from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from fastapi import FastAPI

from src.api.v1.router import api_router
from src.core.config import settings
from src.core.events import lifespan
from src.middleware.cors import add_cors_middleware
from src.middleware.logging import RequestLoggingMiddleware
from src.middleware.rate_limit import limiter

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Middleware (order matters – outermost is applied last)
add_cors_middleware(app)
app.add_middleware(RequestLoggingMiddleware)

# Routers
app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
def root() -> dict:
    return {
        "message": f"Welcome to {settings.APP_NAME} v{settings.APP_VERSION}",
        "docs": "/docs",
        "health": "/api/v1/health/",
    }


# Placeholder – superseded by /api/v1/auth/login
async def login_for_access_token() -> None:
    pass


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
