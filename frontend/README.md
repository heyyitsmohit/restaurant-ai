# Bistro Moderne — Restaurant Frontend

A production-ready restaurant website with React 18, Tailwind CSS, React Router, and an integrated AI chatbot widget.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (runs on http://localhost:5173)
npm run dev
```

The app works **without a backend** — all pages fall back to mock data automatically.

## Project Structure

```
src/
├── api/
│   └── client.js          # All fetch calls + mock fallbacks
├── components/
│   ├── Navbar.jsx          # Sticky nav with cart button
│   ├── ChatWidget.jsx      # Floating AI chatbot overlay
│   ├── MenuCard.jsx        # Menu item card + skeleton
│   ├── CartSidebar.jsx     # Slide-in cart with order form
│   ├── OrderTimeline.jsx   # Status progress steps
│   ├── StatusBadge.jsx     # Color-coded status chip
│   └── Toast.jsx           # Toast notifications + context
├── hooks/
│   ├── useMenu.js          # Fetch + cache menu items
│   ├── useCart.js          # Cart state with useReducer
│   └── useChat.js          # Chat session management
├── pages/
│   ├── Home.jsx            # Landing page with hero
│   ├── Menu.jsx            # Menu grid with filters
│   ├── Track.jsx           # Order tracking page
│   └── Admin.jsx           # Admin dashboard
├── App.jsx                 # Router + cart state
└── main.jsx
```

## API Integration

The Vite dev server proxies `/api/*` to `http://localhost:8000` automatically (see `vite.config.js`).

Your FastAPI backend needs CORS configured:
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

## Features

- **Home**: Hero section, features, about, footer
- **Menu** (`/menu`): Filter by category, search, add to cart, cart sidebar with order form
- **Track** (`/track`): Order ID lookup with animated status timeline (try `DEMO-001`)
- **Admin** (`/admin`): Live order table with inline status updates, auto-refreshes every 30s
- **Chat widget**: Floating bottom-right button, session persisted in localStorage
- Responsive from 375px to 1440px+
- Loading skeletons, toast notifications, error states throughout
