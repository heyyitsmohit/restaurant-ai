from fastapi import APIRouter, Depends, Query, HTTPException
from database import get_db
from sqlalchemy.orm import Session
import schemas
from models import MenuItem, CategoryEnum
from typing import Optional

router = APIRouter(prefix="/api/menu", tags=["Menu"])


@router.get("/", response_model=list[schemas.MenuItemResponse])
def get_menu(
    category: Optional[CategoryEnum] = Query(None, description="Filter by category"),
    available: Optional[bool] = Query(None, description = "Filter by availability"),
    db: Session = Depends(get_db),
    ):

    """
    Returns all menu items.
    Optionally filter by ?category=mains or ?available=true
    Used by: Menu page, AI agent browse-menu tool.
    """
    query = db.query(MenuItem)

    if category is not None:
        query = query.filter(MenuItem.category == category)

    if available is not None:
        query = query.filter(MenuItem.available == available)

    return query.order_by(MenuItem.category, MenuItem.name).all()


@router.get("/{item_id}", response_model=schemas.MenuItemResponse)
def get_menu_item(item_id:str, db: Session = Depends(get_db)):
    """
    Returns a single menu item by ID.
    Used by: AI agent when fetching details of a specific item.
    """
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item

@router.post("/", status_code = 201)
def create_menu_item(payload: schemas.MenuItemCreate, db: Session = Depends(get_db)):
    """
    Add a new item to the menu.
    Used by: Admin dashboard.
    """
    item = MenuItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.patch("/{item_id}", response_model=schemas.MenuItemResponse)
def update_menu_item(item_id: str, payload: schemas.MenuItemUpdate, db: Session = Depends(get_db)):
    """
    Partially update a menu item (price, availability, description, etc).
    Used by: Admin dashboard.
    """
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    update = payload.model_dump(exclude_unset=True)
    for field, value in update.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def delete_menu_item(item_id: str, db: Session = Depends(get_db)):
    """
    Delete a menu item permanently.
    Tip: prefer PATCH available=false to hide items instead of deleting.
    Used by: Admin dashboard.
    """
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    db.delete(item)
    db.commit()