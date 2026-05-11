import datetime
from pydantic import BaseModel, Field
from typing import Optional
from models import CategoryEnum, OrderStatusEnum

class MenuItemCreate(BaseModel):
    name:        str            = Field(..., min_length=1, max_length=120)
    description: Optional[str] = None
    price:       float          = Field(..., gt=0)
    category:    CategoryEnum
    image_url:   Optional[str] = None
    available:   bool           = True
 
 
class MenuItemUpdate(BaseModel):
    name:        Optional[str]   = Field(None, min_length=1, max_length=120)
    description: Optional[str]   = None
    price:       Optional[float] = Field(None, gt=0)
    category:    Optional[CategoryEnum] = None
    image_url:   Optional[str]   = None
    available:   Optional[bool]  = None
 
 
class MenuItemResponse(BaseModel):
    id:          str
    name:        str
    description: Optional[str]
    price:       float
    category:    CategoryEnum
    image_url:   Optional[str]
    available:   bool
 
    model_config = {"from_attributes": True}




# Orders Response 

class OrderItemResponse(BaseModel):
    id:           str
    menu_item_id: str
    menu_item_name: str
    quantity:     int
    unit_price:   float
    subtotal:     float
 
    model_config = {"from_attributes": True}
 
 
class OrderResponse(BaseModel):
    id:                str
    status:            OrderStatusEnum
    total:             float
    notes:             Optional[str]
    estimated_minutes: Optional[int]
    customer_name:     str
    phone:             str
    items:             list[OrderItemResponse]
    created_at:        datetime
    updated_at:        datetime
 
    model_config = {"from_attributes": True}
 
 
class OrderSummaryResponse(BaseModel):
    """Lighter response for the admin list view — no nested items detail."""
    id:                str
    status:            OrderStatusEnum
    total:             float
    customer_name:     str
    phone:             str
    estimated_minutes: Optional[int]
    item_count:        int
    created_at:        datetime
 
    model_config = {"from_attributes": True}