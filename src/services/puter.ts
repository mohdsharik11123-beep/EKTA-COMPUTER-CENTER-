import { PuterUser } from '../types';

/**
 * Service wrapper for official Puter.js SDK
 * Follows official docs: https://docs.puter.com/llms.txt
 */

export const isPuterAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.puter !== 'undefined';
};

export const puterAuth = {
  async isSignedIn(): Promise<boolean> {
    if (!isPuterAvailable()) {
      const cached = localStorage.getItem('ecc_local_auth_session');
      return cached ? true : false;
    }
    try {
      const res = await window.puter!.auth.isSignedIn();
      return Boolean(res);
    } catch (e) {
      console.warn('Puter.auth.isSignedIn check failed:', e);
      const cached = localStorage.getItem('ecc_local_auth_session');
      return Boolean(cached);
    }
  },

  async signIn(options?: { attempt_temp_user_creation?: boolean; request_auth?: boolean }): Promise<PuterUser | null> {
    if (!isPuterAvailable()) {
      throw new Error('Puter.js SDK is not loaded. Please check your internet connection.');
    }
    try {
      // Official Puter signIn popup
      await window.puter!.auth.signIn(options);
      const user = await window.puter!.auth.getUser();
      if (user) {
        localStorage.setItem('ecc_local_auth_session', JSON.stringify(user));
      }
      return user || null;
    } catch (error: unknown) {
      console.error('Puter signIn error:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    localStorage.removeItem('ecc_local_auth_session');
    if (isPuterAvailable()) {
      try {
        await window.puter!.auth.signOut();
      } catch (err) {
        console.warn('Puter signOut error:', err);
      }
    }
  },

  async getUser(): Promise<PuterUser | null> {
    if (isPuterAvailable()) {
      try {
        const signedIn = await this.isSignedIn();
        if (signedIn) {
          const user = await window.puter!.auth.getUser();
          if (user) {
            localStorage.setItem('ecc_local_auth_session', JSON.stringify(user));
            return user;
          }
        }
      } catch (err) {
        console.warn('Puter getUser error:', err);
      }
    }
    const cached = localStorage.getItem('ecc_local_auth_session');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  }
};

export const puterKV = {
  async get<T>(key: string, defaultValue: T): Promise<T> {
    // Check Puter KV first
    if (isPuterAvailable()) {
      try {
        const val = await window.puter!.kv.get<T>(key);
        if (val !== undefined && val !== null) {
          // Keep local cache fresh
          try {
            localStorage.setItem(key, JSON.stringify(val));
          } catch {
            // ignore quota errors
          }
          return val;
        }
      } catch (err) {
        console.warn(`Puter.kv.get failed for key "${key}", checking local storage:`, err);
      }
    }

    // Fallback to local storage
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
    } catch (e) {
      console.warn(`LocalStorage read error for "${key}":`, e);
    }

    return defaultValue;
  },

  async set<T>(key: string, value: T): Promise<boolean> {
    let puterSuccess = false;

    // Cache locally first for instant reactivity & reliability
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`LocalStorage write error for "${key}":`, e);
    }

    // Persist to Puter KV
    if (isPuterAvailable()) {
      try {
        puterSuccess = await window.puter!.kv.set(key, value);
      } catch (err) {
        console.warn(`Puter.kv.set failed for "${key}":`, err);
      }
    }

    return puterSuccess;
  },

  async del(key: string): Promise<boolean> {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('LocalStorage remove failed:', e);
    }

    if (isPuterAvailable()) {
      try {
        return await window.puter!.kv.del(key);
      } catch (err) {
        console.warn(`Puter.kv.del failed for "${key}":`, err);
      }
    }
    return true;
  }
};

export const puterFS = {
  async uploadFile(file: File, folder: string = 'gallery'): Promise<string> {
    const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `ekta-computer-center/${folder}/${cleanFileName}`;

    if (isPuterAvailable()) {
      try {
        // Write file using Puter.fs API
        await window.puter!.fs.write(filePath, file, {
          createMissingParents: true,
          overwrite: true
        });

        // Get public URL using official puter.fs.getReadURL
        const url = await window.puter!.fs.getReadURL(filePath, '365d');
        if (url) {
          return url;
        }
      } catch (err) {
        console.warn('Puter.fs upload failed, falling back to data URL:', err);
      }
    }

    // Graceful reliable fallback: Base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
};
