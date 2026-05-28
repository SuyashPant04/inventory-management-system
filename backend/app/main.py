from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.product_routes import (
    router as product_router
)

from app.routes.customer_routes import (
    router as customer_router
)

from app.routes.order_routes import (
    router as order_router
)

from app.routes.dashboard_routes import (
    router as dashboard_router
)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(product_router)
app.include_router(customer_router)
app.include_router(order_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {
        "message": "Inventory Management API Running"
    }