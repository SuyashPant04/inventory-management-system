from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.dependencies.db import get_db

from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db)
):

    total_products = (
        db.query(Product).count()
    )

    total_customers = (
        db.query(Customer).count()
    )

    total_orders = (
        db.query(Order).count()
    )

    low_stock_products = (
        db.query(Product)
        .filter(Product.stock < 5)
        .count()
    )

    total_revenue = (
        db.query(func.sum(Order.total_amount))
        .scalar()
    )

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_products": low_stock_products,
        "total_revenue": total_revenue or 0
    }
