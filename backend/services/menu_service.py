from typing import Optional
from fastapi import HTTPException
from models import CategoryEnum
from sqlalchemy.orm import Session
from models import MenuItem
import schemas


def get_menu_db(
        db: Session,
        category: Optional[CategoryEnum] = None,
        available: Optional[bool] = None,
        ):
    query = db.query(MenuItem)

    if category is not None:
        query = query.filter(MenuItem.category == category)

    if available is not None:
        query = query.filter(MenuItem.available == available)

    return query.order_by(MenuItem.category, MenuItem.name).all()


def get_menu_item_db(db: Session, item_id: str):
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item


def create_menu_item_db(
        db: Session,
        payload: schemas.MenuItemCreate
    ):
    item = MenuItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_menu_item_db(
        db: Session, 
        item_id: str, 
        payload: schemas.MenuItemUpdate
    ):
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    update = payload.model_dump(exclude_unset=True)
    for field, value in update.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


def delete_menu_item_db(
        db: Session,
        item_id: str,
    ):
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    db.delete(item)
    db.commit()