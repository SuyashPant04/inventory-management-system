from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.models.customer import Customer

from app.schemas.customer import (
    CustomerCreate,
    CustomerUpdate
)

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


# Create Customer
@router.post("/")
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):

    existing_customer = (
        db.query(Customer)
        .filter(Customer.email == customer.email)
        .first()
    )

    if existing_customer:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    db_customer = Customer(
        name=customer.name,
        email=customer.email
    )

    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)

    return db_customer


# Get All Customers
@router.get("/")
def get_customers(
    db: Session = Depends(get_db)
):

    return db.query(Customer).all()


# Get Single Customer
@router.get("/{customer_id}")
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer


# Update Customer
@router.put("/{customer_id}")
def update_customer(
    customer_id: int,
    updated_customer: CustomerUpdate,
    db: Session = Depends(get_db)
):

    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    existing_customer = (
        db.query(Customer)
        .filter(
            Customer.email == updated_customer.email,
            Customer.id != customer_id
        )
        .first()
    )

    if existing_customer:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    customer.name = updated_customer.name
    customer.email = updated_customer.email

    db.commit()
    db.refresh(customer)

    return customer


# Delete Customer
@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    db.delete(customer)
    db.commit()

    return {
        "message": "Customer deleted successfully"
    }
