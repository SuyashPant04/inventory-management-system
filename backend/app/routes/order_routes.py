from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.dependencies.db import get_db

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.customer import Customer

from app.schemas.order import (
    OrderCreate,
    OrderResponse
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


# Create Order
@router.post(
    "/",
    response_model=OrderResponse
)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):

    try:

        customer = (
            db.query(Customer)
            .filter(Customer.id == order.customer_id)
            .first()
        )

        if not customer:
            raise HTTPException(
                status_code=404,
                detail="Customer not found"
            )

        total_amount = 0

        db_order = Order(
            customer_id=order.customer_id,
            total_amount=0
        )

        db.add(db_order)
        db.flush()

        for item in order.items:

            product = (
                db.query(Product)
                .filter(Product.id == item.product_id)
                .first()
            )

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product {item.product_id} not found"
                )

            if item.quantity > product.stock:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}"
                )

            product.stock -= item.quantity

            item_total = (
                product.price * item.quantity
            )

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

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# Get All Orders
@router.get(
    "/",
    response_model=list[OrderResponse]
)
def get_orders(
    db: Session = Depends(get_db)
):

    return db.query(Order).all()


# Get Single Order
@router.get(
    "/{order_id}",
    response_model=OrderResponse
)
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order
