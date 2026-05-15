from fastapi import APIRouter, Depends, Query
from database import get_db
from sqlalchemy.orm import Session
import schemas
from models import OrderStatusEnum
from typing import Optional
from services import order_service


router = APIRouter(prefix="/api/orders", tags=["Order"])



@router.post('/', response_model=schemas.OrderResponse)
def place_order(payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    """
    Place a new order.
    Used by: Menu page cart, AI agent place-order tool.
    """

    return order_service.place_order_db(db, payload)


@router.get('/', response_model=list[schemas.OrderSummaryResponse])
def list_orders(
    status: Optional[OrderStatusEnum] = Query(None, description="Filter by status"),
    db: Session = Depends(get_db),
    ):

    """
    List all orders (summary view).
    Optionally filter by ?status=preparing
    Used by: Admin dashboard.
    """

    return order_service.list_orders_db(db, status)


@router.get("/{order_id}", response_model=schemas.OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db)):
    """
    Get full order details by ID.
    Used by: Track page, AI agent track-order tool.
    """

    return order_service.get_order_db(db, order_id)


@router.patch("/{order_id}/status", response_model= schemas.OrderResponse)
def update_order_status(
    order_id: str,
    payload: schemas.StatusUpdate,
    db: Session = Depends(get_db),
):
    """
    Update order status and optionally set estimated_minutes.
    Used by: Admin dashboard.
    """

    return order_service.update_order_status_db(db, order_id, payload)