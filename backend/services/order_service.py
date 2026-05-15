from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
import schemas
from typing import Optional
from models import Order, MenuItem, Customer, OrderItem, OrderStatusEnum



def _build_order_response(order: Order) -> schemas.OrderResponse:

    return schemas.OrderResponse(
        id = order.id,
        status= order.status,
        total= order.total,
        notes= order.notes,
        estimated_minutes= order.estimated_minutes,
        customer_name= order.customer.name,
        phone= order.customer.phone,
        created_at= order.created_at,
        updated_at= order.updated_at,
        items=[
            schemas.OrderItemResponse(
                id= oi.id,
                menu_item_id= oi.menu_item_id,
                menu_item_name= oi.menu_item.name,
                quantity= oi.quantity,
                unit_price= oi.unit_price,
                subtotal= oi.subtotal
            )
            for oi in order.order_items
        ]
    )



def place_order_db(
        db: Session,
        payload: schemas.OrderCreate,
    ):
    resolved_items = []
    for item_in in payload.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_in.menu_item_id).first()
        if not menu_item:
            raise HTTPException(
                status_code=404,
                detail=f"Menu item '{item_in.menu_item_id}' not found",
            )
        if not menu_item.available:
            raise HTTPException(
                status_code=404,
                detail=f"'{menu_item.name}' is currently unavailable"
            )
        resolved_items.append((menu_item, item_in.quantity))

    
    customer = db.query(Customer).filter(Customer.phone == payload.phone).first()
    if not customer:
        customer = Customer(name=payload.customer_name, phone= payload.phone)
        db.add(customer)
        db.flush()

    
    total = round(sum(mi.price * qty for mi, qty in resolved_items), 2)


    order = Order(
        customer_id=customer.id,
        total=total,
        notes=payload.notes,
    )
    db.add(order)
    db.flush()


    for menu_item, quantity in resolved_items:
        order_item = OrderItem(
            order_id=order.id,
            menu_item_id=menu_item.id,
            quantity=quantity,
            unit_price=menu_item.price,
        )
        db.add(order_item)

    db.commit()
    db.refresh(order)

    order = (
        db.query(Order)
        .options( 
            joinedload(Order.customer), 
            joinedload(Order.order_items).joinedload(OrderItem.menu_item),
        )
        .filter(Order.id == order.id)
        .first()
    )

    return _build_order_response(order)


def list_orders_db(
        db: Session,
        status: Optional[OrderStatusEnum] = None,
    ):
    query = (
        db.query(Order)
        .options(
            joinedload(Order.customer),
            joinedload(Order.order_items),
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


def get_order_db(
        db: Session,
        order_id: str,
    ):
    order = (
        db.query(Order)
        .options(
            joinedload(Order.customer),
            joinedload(Order.order_items).joinedload(OrderItem.menu_item)
        )
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return _build_order_response(order)


def update_order_status_db(
        db: Session,
        order_id: str,
        payload: schemas.StatusUpdate,
    ):
    order = (
        db.query(Order)
        .options(
            joinedload(Order.customer),
            joinedload(Order.order_items).joinedload(OrderItem.menu_item)
        )
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    flow = [s.value for s in OrderStatusEnum]
    current_idx = flow.index(order.status.value)
    new_idx = flow.index(payload.status.value)

    if new_idx < current_idx:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot move order back from '{order.status.value}' to '{payload.status.value}'",
        )
    
    order.status = payload.status
    if payload.estimated_minutes is not None:
        order.estimated_minutes = payload.estimated_minutes

    db.commit()
    db.refresh(order)
    return _build_order_response(order)