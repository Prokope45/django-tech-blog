import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    indexes: null,
  },
});

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const STORAGE_PREFIX = 'api_cache:';

export function buildCacheKey(url: string, params?: unknown): string {
  if (!params) return url;
  if (typeof params === 'object') {
    const keys = Object.keys(params as Record<string, unknown>).sort();
    const sorted: Record<string, unknown> = {};
    for (const k of keys) {
      sorted[k] = (params as Record<string, unknown>)[k];
    }
    return `${url}?${JSON.stringify(sorted)}`;
  }
  return `${url}?${JSON.stringify(params)}`;
}

export function getCached<T>(url: string, params?: unknown, ttl = DEFAULT_TTL): T | null {
  const key = buildCacheKey(url, params);
  let entry = memoryCache.get(key);

  if (!entry) {
    try {
      const stored = sessionStorage.getItem(STORAGE_PREFIX + key);
      if (stored) {
        const parsed = JSON.parse(stored) as CacheEntry;
        if (parsed && typeof parsed.timestamp === 'number') {
          entry = parsed;
          memoryCache.set(key, entry);
        }
      }
    } catch {
      // sessionStorage may fail in private browsing or disabled
    }
  }

  if (entry && Date.now() - entry.timestamp < ttl) {
    try {
      return typeof structuredClone === 'function'
        ? structuredClone(entry.data as T)
        : JSON.parse(JSON.stringify(entry.data));
    } catch {
      return entry.data as T;
    }
  }
  return null;
}

export function setCached(url: string, params: unknown, data: unknown): void {
  const key = buildCacheKey(url, params);
  const entry: CacheEntry = { data, timestamp: Date.now() };
  memoryCache.set(key, entry);
  try {
    sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearCache(): void {
  memoryCache.clear();
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => sessionStorage.removeItem(k));
  } catch {
    // Ignore sessionStorage errors
  }
}

// Override client.get with transparent caching and stale-while-revalidate
const originalGet = client.get.bind(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(client as any).get = async function <T = any, R = AxiosResponse<T>, D = any>(
  url: string,
  config?: AxiosRequestConfig<D>
): Promise<R> {
  const skipCache = config?.headers?.['Cache-Control'] === 'no-cache';
  if (!skipCache) {
    const cachedData = getCached<T>(url, config?.params);
    if (cachedData !== null) {
      // Background revalidation
      originalGet<T, R, D>(url, config)
        .then(res => {
          const r = res as unknown as AxiosResponse<T>;
          if (r && r.status >= 200 && r.status < 300) {
            setCached(url, config?.params, r.data);
          }
        })
        .catch(() => {});

      return {
        data: cachedData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || {},
      } as unknown as R;
    }
  }

  const response = await originalGet<T, R, D>(url, config);
  const res = response as unknown as AxiosResponse<T>;
  if (res && res.status >= 200 && res.status < 300) {
    setCached(url, config?.params, res.data);
  }
  return response;
};

export default client;
