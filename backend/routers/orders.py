from fastapi import APIRouter, Depends, HTTPException, Query
from database import get_db
from sqlalchemy.orm import Session, joinedload
import schemas
from models import Order, OrderItem, OrderStatusEnum
from typing import Optional

router = APIRouter(prefix="/api/order", tags=["Order"])


@router.get('/', response_model=schemas.list[schemas.OrderSummaryResponse])
def list_orders(
    status: Optional[OrderStatusEnum] = Query(None, description="Filter by status"),
    db: Session = Depends(get_db),
    ):

    """
    List all orders (summary view).
    Optionally filter by ?status=preparing
    Used by: Admin dashboard.
    """
    query = (
        db.query(Order)
        .options(
            joinedload(Order.customer),
            joinedload(Order.OrderItem),
        )
        .order_by(Order.created_at.desc())
    )

    if status is not None:
        query = query.filter(Order.status == status)

    orders = query.all()
    return[
        schemas.OrderSummaryResponse(
            id=o.id,
            status=o.status,
            total=o.total,
            customer_name=o.customer.name,
            phone=o.customer.phone,
            estimated_minutes=o.estimated_minutes,
            item_count=sum(oi.quantity for oi in o.order_items),
            created_at=o.created_at,
        )
        for o in orders
    ]

@router.get("/{item_id}", response_model=schemas.OrderResponse)
def get_order(item_id: str, db: Session = Depends(get_db)):
    """
    Get full order details by ID.
    Used by: Track page, AI agent track-order tool.
    """
    order = (
        db.query(Order)
        .options(
            joinedload(Order.customer),
            joinedload(Order.order_items).joinedload(OrderItem.menu_item)
        )
        .filter(Order.id == item_id)
        .first()
    )

    if not Order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return