import { RedisClientType, createClient } from 'redis';
import logger from '@/utils/logger';
import ICacheService, { CacheDuration, CachePrefixes } from '@/domain/interface/services/ICacheService';


export class CacheService implements ICacheService {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({
            socket: {
                host: '127.0.0.1',
                port: 6379,
            },
        });

        this.client.on('error', (err) => logger.error(`Redis error: ${err.message}`));
        this.connectRedis();
    }

    private async connectRedis(): Promise<void> {
        try {
            await this.client.connect();
            await this.client.flushAll()
        } catch (error) {
            logger.error(`Failed to connect to Redis: ${error}`);
        }
    }

    async setCache<T>(prefix: CachePrefixes, key: string, value: T, expTime: CacheDuration = CacheDuration.OneHour): Promise<void> {
        const cacheKey = `${prefix}${key}`;
        await this.client.set(cacheKey, JSON.stringify(value), { EX: expTime });

    }

    async getCache<T>(prefix: CachePrefixes, key: string): Promise<T | null> {
        const cacheKey = `${prefix}${key}`;
        const data = await this.client.get(cacheKey);
        return data ? (JSON.parse(data) as T) : null;
    }

    async deleteCache(prefix: CachePrefixes, key: string): Promise<void> {
        const cacheKey = `${prefix}${key}`;
        await this.client.del(cacheKey);
    }

    async clearCacheByPrefix(prefix: CachePrefixes): Promise<void> {
        const keys = await this.client.keys(`${prefix}*`);
        if (keys.length > 0) {
            await this.client.del(keys);
        }
    }
}
