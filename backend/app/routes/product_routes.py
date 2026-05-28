from fastapi import (
    APIRouter,
    Depends,
    Query,
    HTTPException
)

from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.models.product import Product

from app.schemas.product import (
    ProductCreate,
    ProductUpdate
)

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# Create Product
@router.post("/")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    existing_product = (
        db.query(Product)
        .filter(Product.sku == product.sku)
        .first()
    )

    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

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


# Get Products with Pagination
@router.get("/")
def get_products(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):

    return (
        db.query(Product)
        .offset(skip)
        .limit(limit)
        .all()
    )


# Search Products
@router.get("/search")
def search_products(
    q: str = Query(...),
    db: Session = Depends(get_db)
):

    products = (
        db.query(Product)
        .filter(Product.name.ilike(f"%{q}%"))
        .all()
    )

    return products


# Get Single Product
@router.get("/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# Update Product
@router.put("/{product_id}")
def update_product(
    product_id: int,
    updated_product: ProductUpdate,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    existing_product = (
        db.query(Product)
        .filter(
            Product.sku == updated_product.sku,
            Product.id != product_id
        )
        .first()
    )

    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    product.name = updated_product.name
    product.sku = updated_product.sku
    product.price = updated_product.price
    product.stock = updated_product.stock

    db.commit()
    db.refresh(product)

    return product


# Delete Product
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }