import { create } from 'zustand';
import { openDB, type IDBPDatabase } from 'idb';
import type { WardrobeItem } from '../types';

const DB_NAME = 'fashion-wardrobe';
const STORE_NAME = 'items';
let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

interface WardrobeState {
  items: WardrobeItem[];
  loading: boolean;
  loadItems: () => Promise<void>;
  addItem: (item: WardrobeItem) => Promise<void>;
  updateItem: (item: WardrobeItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  filterItems: (filters: Partial<Record<string, string>>) => WardrobeItem[];
}

export const useWardrobeStore = create<WardrobeState>((set, get) => ({
  items: [],
  loading: false,

  loadItems: async () => {
    set({ loading: true });
    const db = await getDB();
    const items = await db.getAll(STORE_NAME);
    set({ items, loading: false });
  },

  addItem: async (item) => {
    const db = await getDB();
    await db.add(STORE_NAME, item);
    set((s) => ({ items: [...s.items, item] }));
  },

  updateItem: async (item) => {
    const db = await getDB();
    await db.put(STORE_NAME, item);
    set((s) => ({
      items: s.items.map((i) => (i.id === item.id ? item : i)),
    }));
  },

  deleteItem: async (id) => {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  },

  filterItems: (filters) => {
    const { items } = get();
    return items.filter((item) => {
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue;
        if (key === 'category' && item.category !== value) return false;
        if (key === 'primaryColor' && item.attributes.primaryColor !== value) return false;
        if (key === 'season' && item.attributes.season !== value) return false;
        if (key === 'formality' && item.attributes.formality !== value) return false;
        if (key === 'isFavorite' && !item.isFavorite) return false;
      }
      return true;
    });
  },
}));
