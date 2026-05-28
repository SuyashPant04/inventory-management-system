from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.models.customer import Customer
from app.schemas.customer import (
    CustomerCreate,
    CustomerUpdate
)

router = APIRouter()

@router.post("/customers")
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
        return {"error": "Email already exists"}

    db_customer = Customer(
        name=customer.name,
        email=customer.email
    )

    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)

    return db_customer


@router.get("/customers")
def get_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()


@router.get("/customers/{customer_id}")
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )


@router.put("/customers/{customer_id}")
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
        return {"error": "Customer not found"}

    customer.name = updated_customer.name
    customer.email = updated_customer.email

    db.commit()
    db.refresh(customer)

    return customer


@router.delete("/customers/{customer_id}")
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
        return {"error": "Customer not found"}

    db.delete(customer)
    db.commit()

    return {"message": "Customer deleted successfully"}