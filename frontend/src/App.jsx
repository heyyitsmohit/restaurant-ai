// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import CartSidebar from './components/CartSidebar';
import { ToastProvider } from './components/Toast';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Track from './pages/Track';
// import Admin from './pages/Admin';
import { useCart } from './hooks/useCart';

function AppLayout() {
  const {
    items, subtotal, totalItems, isOpen,
    addItem, removeItem, updateQty, clearCart,
    openCart, closeCart,
  } = useCart();

  return (
    <>
      <Navbar cartCount={totalItems} onCartOpen={openCart} />
      <CartSidebar
        items={items}
        subtotal={subtotal}
        isOpen={isOpen}
        onClose={closeCart}
        onUpdateQty={updateQty}
        onRemove={removeItem}
        onClear={clearCart}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/menu"
          element={
            <Menu
              onAddToCart={addItem}
              onCartOpen={openCart}
              cartCount={totalItems}
            />
          }
        />
        <Route path="/track" element={<Track />} />
        {/* <Route path="/admin" element={<Admin />} /> */}
      </Routes>
      <ChatWidget />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppLayout />
      </ToastProvider>
    </BrowserRouter>
  );
}
