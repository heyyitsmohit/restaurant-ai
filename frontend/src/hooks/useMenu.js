// hooks/useMenu.js
import { useState, useEffect } from 'react';
import { fetchMenu } from '../api/client';

const cache = { data: null, ts: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // Return cached data if fresh
      if (cache.data && Date.now() - cache.ts < CACHE_TTL) {
        setItems(cache.data);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchMenu();
        cache.data = data;
        cache.ts = Date.now();
        if (!cancelled) setItems(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}
