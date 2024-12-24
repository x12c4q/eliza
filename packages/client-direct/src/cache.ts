// cache.ts
import { MemoryCacheAdapter, CacheManager } from '@elizaos/core';

const cacheAdapter = new MemoryCacheAdapter();
export const cache = new CacheManager(cacheAdapter);
