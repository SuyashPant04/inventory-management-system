from fastapi import FastAPI

from app.database import engine, Base
from app.models import Product
from app.routes.product_routes import router as product_router
from app.routes.customer_routes import router as customer_router

app = FastAPI()

app.include_router(product_router)
app.include_router(customer_router)

@app.get("/")
def root():
    return {"message": "Inventory Management API Running"}  