from langchain_core.tools import tool
from typing import Optional
from sqlalchemy.orm import Session
from services import menu_service, order_service
from models import CategoryEnum
import schemas

def make_tools(db: Session):

    @tool
    def browse_menu(
        category: Optional[str] = None,
    )-> str:
        """
        Browse the restaurant menu and return available items.

        Use this tool when:
        - The user asks what food or drinks are available.
        - The user wants recommendations or asks 'what do you have?'.
        - You need to get valid menu_item_ids before calling place_order.

        Do NOT invent or assume menu items. Always call this tool first
        before suggesting anything to the user.

        Args:
            category: Optional filter. Must be one of: starters, mains, desserts, drinks.
                      Leave empty to get the full menu.

        Examples:
            browse_menu()                  → returns full menu
            browse_menu("mains")           → returns only main courses
            browse_menu("drinks")          → returns only drinks
        """
        cat = None
        if category:
            try:
                cat = CategoryEnum(category.lower())
            except:
                return f"Unknown category '{category}'. Valid: starters, mains, desserts, drinks."
        
        items = menu_service.get_menu_db(db, category=cat, available=True)

        if not items:
            return "No menu item found"
        
        rows = []

        if cat:
            for item in items:
                rows.append(f"\n* {item.name} ${item.price} (id: {item.id})")

        else:
            current_cat = None
            for item in items:
                if item.category != current_cat:
                    current_cat = item.category
                    rows.append(f"\n[{current_cat.value.upper()}]")
                rows.append(f"* {item.name} {item.price} (id: {item.id})")
        
        return "\n".join(rows)



    @tool
    def place_order(
        menu_item_id: list[str],
        quantity: list[int],
        customer_name: str,
        phone: str,
        notes: Optional[str],
    )-> str:

        """
        Place a new food order for the customer.

        Use this tool ONLY after you have confirmed the following with the user:
        - The exact items and quantities they want
        - Their name and phone number

        Args:
            menu_item_ids: List of menu item IDs to order. Get these from browse_menu.
            quantities:    List of quantities matching each menu_item_id.
            customer_name: Full name of the customer.
            phone:         Customer phone number for order tracking.
            notes:         Optional special instructions e.g. 'no onions', 'extra sauce'.

        Example:
            User wants 2 Margheritas and 1 Coke:
            menu_item_ids = ["uuid-abc", "uuid-xyz"]
            quantities    = [2, 1]
        """
        payload = schemas.OrderCreate(
            items= [
                schemas.OrderItemIn(menu_item_id= item_id, quantity= qty)
                for item_id, qty in zip(menu_item_id, quantity)
            ],
            customer_name=customer_name,
            phone=phone,
            notes=notes
        )

        result = order_service.place_order_db(db, payload=payload)

        return (
            f"Order placed successfully!\n"
            f"Order ID: {result.id}\n"
            f"Total : ${result.total}\n"
            f"Status: {result.status.value}\n"
            f"Use this Order ID to track your order."
        )


    @tool
    def track_order(
        order_id: str
    ):
        """
        Track the current status of an existing order.

        Use this tool when:
        - The user provides an order ID and asks where their order is.
        - The user asks 'is my order ready?', 'how long till my food arrives?' etc.

        Do NOT guess or make up a status. Always call this tool with the exact
        order ID the user provides.

        Args:
            order_id: The unique order ID given to the customer when they placed the order.
        """

        order = order_service.get_order_db(db, order_id = order_id)
        items = []
        for i in order.items:
            items.append(f"* {i.menu_item_name} x {i.quantity}")

        return (
            f"Order '{order.id}'\n"
            f"Order status: {order.status}\n"
            f"Name: {order.customer_name}\n"
            f"Note: {order.notes}\n"
            f"items: " + "\n".join(items) +
            f"Your order will deliver in {order.estimated_minutes}"
        )

    return [browse_menu, place_order, track_order]