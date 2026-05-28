from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.db import get_db

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.customer import Customer

from app.schemas.order import OrderCreate

router = APIRouter()

@router.post("/orders")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):
    customer = (
        db.query(Customer)
        .filter(Customer.id == order.customer_id)
        .first()
    )

    if not customer:
        return {"error": "Customer not found"}

    total_amount = 0

    db_order = Order(
        customer_id=order.customer_id,
        total_amount=0
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:

        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        if not product:
            return {
                "error": f"Product {item.product_id} not found"
            }

        if item.quantity > product.stock:
            return {
                "error": f"Insufficient stock for {product.name}"
            }

        product.stock -= item.quantity

        item_total = product.price * item.quantity

        total_amount += item_total

        db_order_item = OrderItem(
            order_id=db_order.id,
            product_id=product.id,
            quantity=item.quantity,
            unit_price=product.price
        )

        db.add(db_order_item)

    db_order.total_amount = total_amount

    db.commit()
    db.refresh(db_order)

    return db_order