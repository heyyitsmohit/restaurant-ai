// api/client.js
// NOTE: Backend must have CORS headers set for http://localhost:5173 (Vite default)
// FastAPI: add CORSMiddleware with allow_origins=["http://localhost:5173"]

const BASE_URL = 'http://localhost:8000';

// ─── Mock Data (fallback when API is unavailable) ─────────────────────────────
export const MOCK_MENU = [
  { id: 1, name: 'Burrata & Heirloom Tomato', description: 'Creamy burrata with roasted heirloom tomatoes, basil oil, and flaky sea salt.', price: 14.00, category: 'Starters', image_url: 'https://images.unsplash.com/photo-1607116667981-ff148f108f79?w=400&q=80' },
  { id: 2, name: 'Crispy Calamari', description: 'Lightly breaded rings with lemon aioli and smoked paprika dipping sauce.', price: 12.00, category: 'Starters', image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80' },
  { id: 3, name: 'Roasted Beet Salad', description: 'Golden and red beets, whipped goat cheese, candied walnuts, micro greens.', price: 11.00, category: 'Starters', image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80' },
  { id: 4, name: 'Margherita Pizza', description: 'San Marzano tomato, fior di latte mozzarella, fresh basil, extra virgin olive oil.', price: 18.00, category: 'Mains', image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80' },
  { id: 5, name: 'Braised Short Rib', description: '12-hour red wine braised short rib, creamy polenta, gremolata.', price: 32.00, category: 'Mains', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80' },
  { id: 6, name: 'Pan-Seared Salmon', description: 'Atlantic salmon, lemon beurre blanc, haricots verts, fingerling potatoes.', price: 28.00, category: 'Mains', image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80' },
  { id: 7, name: 'Wild Mushroom Risotto', description: 'Carnaroli rice, porcini, cremini, truffle oil, aged Parmigiano-Reggiano.', price: 22.00, category: 'Mains', image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80' },
  { id: 8, name: 'Chocolate Fondant', description: 'Warm dark chocolate lava cake, vanilla bean gelato, cocoa tuile.', price: 10.00, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80' },
  { id: 9, name: 'Tiramisu', description: 'Classic layered espresso-soaked ladyfingers, mascarpone, cocoa dusting.', price: 9.00, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80' },
  { id: 10, name: 'Seasonal Sorbet', description: 'Three scoops of housemade sorbet, seasonal fruits, mint.', price: 8.00, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&q=80' },
  { id: 11, name: 'Negroni Sbagliato', description: 'Campari, sweet vermouth, Prosecco, orange twist.', price: 13.00, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc9d2b?w=400&q=80' },
  { id: 12, name: 'Housemade Lemonade', description: 'Fresh-squeezed lemon, rosemary simple syrup, still or sparkling water.', price: 5.00, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80' },
];

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Menu ─────────────────────────────────────────────────────────────────────
export async function fetchMenu() {
  try {
    return await apiFetch('/api/menu');
  } catch {
    console.warn('Menu API unavailable, using mock data');
    return MOCK_MENU;
  }
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function placeOrder(payload) {
  // payload: { items: [{menu_item_id, quantity}], customer_name, phone }
  return apiFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchOrder(orderId) {
  return apiFetch(`/api/orders/${orderId}`);
}

export async function fetchAllOrders() {
  return apiFetch('/api/orders');
}

export async function updateOrderStatus(orderId, status) {
  return apiFetch(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ─── Agent Chat ───────────────────────────────────────────────────────────────
export async function sendChatMessage(message, session_id) {
  return apiFetch('/api/agent/chat', {
    method: 'POST',
    body: JSON.stringify({ message, session_id }),
  });
}
