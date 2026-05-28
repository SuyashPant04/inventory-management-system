from pydantic import BaseModel
from typing import List


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]


class ProductInfo(BaseModel):
    id: int
    name: str
    price: float

    class Config:
        from_attributes = True


class OrderItemResponse(BaseModel):
    id: int
    quantity: int
    unit_price: float
    product: ProductInfo

    class Config:
        from_attributes = True


class CustomerInfo(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    total_amount: float
    customer: CustomerInfo
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True