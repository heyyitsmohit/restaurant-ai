# restaurant-ai

A full stack restaurant app with a LangGraph AI agent that handles ordering end to end. The agent browses the menu, collects order details from the user, places the order, and tracks it — all through a chat interface.

> Work in progress.

---

## Stack

**Backend** — Python, FastAPI, SQLAlchemy, SQLite  
**AI Agent** — LangGraph, LangChain, Ollama  
**Frontend** — React 18, Tailwind CSS, Vite

---

## Project Structure

```
restaurant/
├── backend/
│   ├── agent/
│   │   ├── graph.py          # LangGraph agent — state, nodes, edges
│   │   └── tools.py          # browse_menu, place_order, track_order
│   ├── routers/
│   │   ├── menu.py           # Menu CRUD routes
│   │   ├── orders.py         # Order routes
│   │   └── agent.py          # /api/agent/chat route
│   ├── services/
│   │   ├── menu_service.py   # Menu business logic
│   │   └── order_service.py  # Order business logic
│   ├── models.py             # SQLAlchemy models
│   ├── schemas.py            # Pydantic schemas
│   ├── database.py           # DB connection + session
│   └── main.py               # FastAPI app entry point
├── frontend/
│   └── src/
│       ├── pages/            # Home, Menu, Track, Admin
│       ├── components/       # Navbar, ChatWidget, MenuCard, etc.
│       ├── hooks/            # useMenu, useCart, useChat
│       └── api/client.js     # All fetch calls
└── requirements.txt
```

---

## How the Agent Works

```
User sends message
    → /api/agent/chat
    → run_agent() loads session history
    → LangGraph invokes agent node
    → agent decides: call a tool or reply
    → if tool → browse_menu / place_order / track_order
    → tools call services → services query DB
    → agent gets tool result → forms reply
    → session history saved
    → reply returned to user
```

---

## API Routes

### Menu
| Method | Route | Description |
|---|---|---|
| GET | `/api/menu/` | List all menu items |
| GET | `/api/menu/{id}` | Get single item |
| POST | `/api/menu/` | Add menu item |
| PATCH | `/api/menu/{id}` | Update item |
| DELETE | `/api/menu/{id}` | Delete item |

### Orders
| Method | Route | Description |
|---|---|---|
| GET | `/api/orders/` | List all orders |
| GET | `/api/orders/{id}` | Get order details |
| POST | `/api/orders/` | Place order |
| PATCH | `/api/orders/{id}/status` | Update order status |

### Agent
| Method | Route | Description |
|---|---|---|
| POST | `/api/agent/chat` | Send message to AI agent |

---

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
# runs on http://localhost:8000
# docs at http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# runs on http://localhost:5173
```

### Ollama (for the AI agent)

```bash
# install ollama then pull your model
ollama pull <your-model>
```

---

## Database

SQLite — file created automatically at `backend/restaurant.db` on first run.

Tables: `menu_items`, `customers`, `orders`, `order_items`

---

## Environment

No `.env` needed for local development. CORS is configured for `http://localhost:5173`.

For production, move secrets to environment variables and swap SQLite for PostgreSQL.