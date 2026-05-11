// hooks/useCart.js
import { useReducer, useCallback } from 'react';

const initialState = { items: [], isOpen: false };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, qty: action.qty } : i
        ),
      };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen };
    default:
      return state;
  }
}

export function useCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((item) => dispatch({ type: 'ADD', item }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', id }), []);
  const updateQty = useCallback((id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const openCart = useCallback(() => dispatch({ type: 'OPEN' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE' }), []);
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE' }), []);

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0);

  return {
    items: state.items,
    isOpen: state.isOpen,
    subtotal,
    totalItems,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  };
}
