# Bistro Moderne — Frontend

React 18 frontend for the Bistro Moderne restaurant app. Works with a FastAPI backend and a LangGraph AI agent for ordering.

> ⚠️ Work in progress — AI agent integration is ongoing.

## Quick Start

```bash
npm install
npm run dev
# runs on http://localhost:5173
```

Works without a backend — all pages fall back to mock data automatically.

## Stack

- React 18
- Tailwind CSS
- React Router
- Vite

## Project Structure

```
src/
├── api/
│   └── client.js              # All fetch calls + mock fallbacks
├── components/
│   ├── Navbar.jsx
│   ├── ChatWidget.jsx         # AI chatbot overlay
│   ├── MenuCard.jsx
│   ├── CartSidebar.jsx
│   ├── OrderTimeline.jsx
│   ├── StatusBadge.jsx
│   └── Toast.jsx
├── hooks/
│   ├── useMenu.js
│   ├── useCart.js
│   └── useChat.js
├── pages/
│   ├── Home.jsx
│   ├── Menu.jsx
│   ├── Track.jsx
│   └── Admin.jsx
├── App.jsx
└── main.jsx
```

## Pages

- **Home** — hero section, features, footer
- **Menu** `/menu` — filter by category, add to cart, cart sidebar
- **Track** `/track` — order tracking with status timeline
- **Admin** `/admin` — live order table, auto-refreshes every 30s

## Backend

Vite proxies `/api/*` to `http://localhost:8000` (see `vite.config.js`).

Add CORS to FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

See the backend folder for the FastAPI + LangGraph setup.