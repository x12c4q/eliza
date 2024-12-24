// cache.ts
import { MemoryCacheAdapter, CacheManager } from '@elizaos/core';

// Create a singleton instance of the cache
const cacheAdapter = new MemoryCacheAdapter();
export const cache = new CacheManager(cacheAdapter);
