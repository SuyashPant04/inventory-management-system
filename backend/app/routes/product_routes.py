from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

router = APIRouter()

# Create a new product
@router.post("/products")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    
    # Check if SKU already exists
    existing_product = (
    db.query(Product)
    .filter(Product.sku == product.sku)
    .first()
    )

    if existing_product:
        return {"error": "SKU already exists"}

    db_product = Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        stock=product.stock
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product

# Get all products
@router.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

# Get a single product by ID
@router.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.id == product_id).first()

# Update a product
@router.put("/products/{product_id}")
def update_product(
    product_id: int,
    updated_product: ProductUpdate,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        return {"error": "Product not found"}

    product.name = updated_product.name
    product.sku = updated_product.sku
    product.price = updated_product.price
    product.stock = updated_product.stock

    db.commit()
    db.refresh(product)

    return product

# Delete a product
@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        return {"error": "Product not found"}

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}