from fastapi import FastAPI

from app.database import get_connection
from app.routes.metrics import router as metrics_router

app = FastAPI(
    title="GitHub Analytics API",
    description="API for the GitHub Analytics Pipeline",
    version="1.0.0",
)

app.include_router(metrics_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/db")
def database_health_check():
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()

        return {"database": "ok", "result": result[0]}

    finally:
        connection.close()