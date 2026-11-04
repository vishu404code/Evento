import { UserProfile } from '../types/auth';

const DB_NAME = 'evento_db';
const DB_VERSION = 1;
const STORE_NAME = 'users';
const LOCAL_STORAGE_KEY = 'evento_users_v1';

class DatabaseService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private isIndexedDBAvailable(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  }

  private getDB(): Promise<IDBDatabase> {
    if (!this.isIndexedDBAvailable()) {
      return Promise.reject(new Error('IndexedDB not supported'));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        try {
          const request = indexedDB.open(DB_NAME, DB_VERSION);

          request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
              store.createIndex('email', 'email', { unique: true });
              store.createIndex('role', 'role', { unique: false });
            }
          };

          request.onsuccess = () => {
            resolve(request.result);
          };

          request.onerror = () => {
            reject(request.error || new Error('Failed to open IndexedDB'));
          };
        } catch (err) {
          reject(err);
        }
      });
    }

    return this.dbPromise;
  }

  // Backup and fallback to localStorage
  private getLocalUsers(): Record<string, UserProfile> {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveLocalUsers(users: Record<string, UserProfile>): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  async getUserById(id: string): Promise<UserProfile | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const req = store.get(id);

        req.onsuccess = () => {
          if (req.result) {
            resolve(req.result as UserProfile);
          } else {
            // Check fallback
            const local = this.getLocalUsers();
            resolve(local[id] || null);
          }
        };

        req.onerror = () => {
          const local = this.getLocalUsers();
          resolve(local[id] || null);
        };
      });
    } catch {
      const local = this.getLocalUsers();
      return local[id] || null;
    }
  }

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('email');
        const req = index.get(normalizedEmail);

        req.onsuccess = () => {
          if (req.result) {
            resolve(req.result as UserProfile);
          } else {
            const local = this.getLocalUsers();
            const found = Object.values(local).find(
              (u) => u.email.toLowerCase() === normalizedEmail
            );
            resolve(found || null);
          }
        };

        req.onerror = () => {
          const local = this.getLocalUsers();
          const found = Object.values(local).find(
            (u) => u.email.toLowerCase() === normalizedEmail
          );
          resolve(found || null);
        };
      });
    } catch {
      const local = this.getLocalUsers();
      const found = Object.values(local).find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );
      return found || null;
    }
  }

  async saveUser(user: UserProfile): Promise<UserProfile> {
    user.email = user.email.trim().toLowerCase();
    user.updated_at = new Date().toISOString();

    // Always update localStorage first for fast fallback
    const local = this.getLocalUsers();
    local[user.id] = user;
    this.saveLocalUsers(local);

    try {
      const db = await this.getDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const req = store.put(user);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('Saved to localStorage fallback, IndexedDB write error:', e);
    }

    return user;
  }

  async updateUser(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const existing = await this.getUserById(id);
    if (!existing) {
      throw new Error(`User with id ${id} not found.`);
    }

    const updatedUser: UserProfile = {
      ...existing,
      ...updates,
      id: existing.id, // ID must remain immutable
      updated_at: new Date().toISOString(),
    };

    return await this.saveUser(updatedUser);
  }

  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          if (req.result && req.result.length > 0) {
            resolve(req.result as UserProfile[]);
          } else {
            resolve(Object.values(this.getLocalUsers()));
          }
        };

        req.onerror = () => {
          resolve(Object.values(this.getLocalUsers()));
        };
      });
    } catch {
      return Object.values(this.getLocalUsers());
    }
  }
}

export const dbService = new DatabaseService();

