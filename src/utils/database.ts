import { DatabaseSchema, Product, Review } from '../types';

const DB_FILE_NAME = 'anand_greenwich.bb';

// Simple hash function for admin PIN
export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + 'anand_salt_2025');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function createEmptyDatabase(): DatabaseSchema {
  return {
    meta: {
      brand: "Anand Greenwich",
      generated_at: new Date().toISOString(),
      version: "1.1"
    },
    settings: {
      theme: 'light',
      admin_pin_hash: '',
      demo_mode: false
    },
    products: []
  };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export async function saveToFileSystem(data: DatabaseSchema): Promise<boolean> {
  try {
    if ('showSaveFilePicker' in window) {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: DB_FILE_NAME,
        types: [{
          description: 'Anand Greenwich Database',
          accept: { 'application/json': ['.bb'] }
        }]
      });
      
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      return true;
    }
  } catch (error) {
    console.error('File System API failed:', error);
  }
  return false;
}

export async function loadFromFileSystem(): Promise<DatabaseSchema | null> {
  try {
    if ('showOpenFilePicker' in window) {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [{
          description: 'Anand Greenwich Database',
          accept: { 'application/json': ['.bb'] }
        }]
      });
      
      const file = await fileHandle.getFile();
      const text = await file.text();
      return JSON.parse(text);
    }
  } catch (error) {
    console.error('File System API failed:', error);
  }
  return null;
}

export function saveToIndexedDB(data: DatabaseSchema): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('anand_greenwich', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['database'], 'readwrite');
      const store = transaction.objectStore('database');
      store.put(data, 'main');
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('database');
    };
  });
}

export function loadFromIndexedDB(): Promise<DatabaseSchema | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('anand_greenwich', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['database'], 'readonly');
      const store = transaction.objectStore('database');
      const getRequest = store.get('main');
      
      getRequest.onsuccess = () => {
        resolve(getRequest.result || null);
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('database');
    };
  });
}

export function downloadDatabase(data: DatabaseSchema, filename: string = DB_FILE_NAME): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function mergeImportedDatabase(existing: DatabaseSchema, imported: DatabaseSchema): DatabaseSchema {
  existing.meta = { ...existing.meta, ...imported.meta };
  existing.settings = { ...existing.settings, ...imported.settings };
  
  const productMap = new Map(existing.products.map(p => [p.id, p]));
  (imported.products || []).forEach(p => productMap.set(p.id, p));
  existing.products = Array.from(productMap.values());
  
  return existing;
}

export function recordSale(product: Product, quantity: number = 1): Product {
  if (product.stock_count < quantity) {
    throw new Error('Not enough stock');
  }
  
  return {
    ...product,
    stock_count: product.stock_count - quantity,
    units_sold: product.units_sold + quantity,
    total_revenue: product.total_revenue + (quantity * product.price)
  };
}

export function addReview(product: Product, review: Omit<Review, 'id' | 'created_at'>): Product {
  const newReview: Review = {
    ...review,
    id: generateId(),
    created_at: new Date().toISOString()
  };
  
  const updatedReviews = [...product.reviews, newReview];
  const ratings = updatedReviews.map(r => r.rating);
  const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  
  const breakdown = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  ratings.forEach(rating => {
    breakdown[rating.toString()]++;
  });
  
  return {
    ...product,
    reviews: updatedReviews,
    rating: {
      avg: Math.round(avg * 10) / 10,
      count: updatedReviews.length,
      breakdown
    }
  };
}

export function getLeaderboard(products: Product[]) {
  const sorted = [...products].sort((a, b) => (b.units_sold || 0) - (a.units_sold || 0));
  const top3 = sorted.slice(0, 3);
  
  const publicTop3 = top3.map((p, idx) => ({
    rank: idx + 1,
    id: p.id,
    name: p.name,
    slug: p.slug,
    thumb: p.images?.[0] || null
  }));
  
  const adminTop3 = top3.map((p, idx) => ({
    rank: idx + 1,
    id: p.id,
    name: p.name,
    units_sold: p.units_sold || 0,
    total_revenue: p.total_revenue || 0
  }));
  
  return { publicTop3, adminTop3 };
}