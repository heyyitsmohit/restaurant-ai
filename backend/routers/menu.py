from fastapi import APIRouter, Depends, Query
from database import get_db
from sqlalchemy.orm import Session
import schemas
from models import CategoryEnum
from typing import Optional
from services import menu_service

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
    return menu_service.get_menu_db(db, category, available)


@router.get("/{item_id}", response_model=schemas.MenuItemResponse)
def get_menu_item(item_id:str, db: Session = Depends(get_db)):
    """
    Returns a single menu item by ID.
    Used by: AI agent when fetching details of a specific item.
    """
    return menu_service.get_menu_item_db(db, item_id)

@router.post("/", status_code = 201)
def create_menu_item(payload: schemas.MenuItemCreate, db: Session = Depends(get_db)):
    """
    Add a new item to the menu.
    Used by: Admin dashboard.
    """
    return menu_service.create_menu_item_db(db, payload)

@router.patch("/{item_id}", response_model=schemas.MenuItemResponse)
def update_menu_item(item_id: str, payload: schemas.MenuItemUpdate, db: Session = Depends(get_db)):
    """
    Partially update a menu item (price, availability, description, etc).
    Used by: Admin dashboard.
    """
    return menu_service.update_menu_item_db(db, item_id, payload)


@router.delete("/{item_id}", status_code=204)
def delete_menu_item(item_id: str, db: Session = Depends(get_db)):
    """
    Delete a menu item permanently.
    Tip: prefer PATCH available=false to hide items instead of deleting.
    Used by: Admin dashboard.
    """
    return menu_service.delete_menu_item_db(db, item_id)