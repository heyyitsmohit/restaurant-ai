from sqlalchemy import Column, String, Text, Float, Integer, Boolean, ForeignKey, Enum, DateTime, func
from sqlalchemy.orm import relationship, DeclarativeBase
import uuid
import enum

class Base(DeclarativeBase):
    pass


def generate_uuid() -> str:
    return str(uuid.uuid4())



class CategoryEnum(str, enum.Enum):
    starters = "starters"
    mains    = "mains"
    desserts = "desserts"
    drinks   = "drinks"

class OrderStatusEnum(str, enum.Enum):
    received  = "received"
    preparing = "preparing"
    ready     = "ready"
    delivered = "delivered"


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    category = Column(Enum(CategoryEnum), nullable=False)
    image_url = Column(String(500), nullable=False)
    available = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    order_items = relationship("OrderItem", back_populates="menu_item")

    def __repr__(self):
        return f"<MenuItem {self.name} - ${self.price}>"
    

class Customer(Base):
    __tablename__ = "customers"
 
    id         = Column(String(36), primary_key=True, default=generate_uuid)
    name       = Column(String(120), nullable=False)
    phone      = Column(String(30), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
 
    orders     = relationship("Order", back_populates="customer")
 
    def __repr__(self):
        return f"<Customer {self.name}>"
    

class Order(Base):
    __tablename__ = "orders"
 
    id                = Column(String(36), primary_key=True, default=generate_uuid)
    customer_id       = Column(String(36), ForeignKey("customers.id"), nullable=False)
    status            = Column(Enum(OrderStatusEnum), default=OrderStatusEnum.received, nullable=False)
    total             = Column(Float, nullable=False)
    estimated_minutes = Column(Integer, nullable=True, default=30)
    notes             = Column(Text, nullable=True)
 
    created_at        = Column(DateTime, server_default=func.now())
    updated_at        = Column(DateTime, server_default=func.now(), onupdate=func.now())
 
    customer    = relationship("Customer", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
 
    def __repr__(self):
        return f"<Order {self.id} — {self.status.value}>"
    
class OrderItem(Base):
    __tablename__ = "order_items"
 
    id           = Column(String(36), primary_key=True, default=generate_uuid)
    order_id     = Column(String(36), ForeignKey("orders.id"),      nullable=False)
    menu_item_id = Column(String(36), ForeignKey("menu_items.id"),  nullable=False)
    quantity     = Column(Integer, nullable=False, default=1)
    unit_price   = Column(Float, nullable=False)
 
    order     = relationship("Order",    back_populates="order_items")
    menu_item = relationship("MenuItem", back_populates="order_items")
 
    @property
    def subtotal(self) -> float:
        return round(self.unit_price * self.quantity, 2)
 
    def __repr__(self):
        return f"<OrderItem {self.quantity}× {self.menu_item_id}>"