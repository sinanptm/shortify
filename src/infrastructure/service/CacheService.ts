import { RedisClientType, createClient } from 'redis';
import logger from '@/utils/logger';
import ICacheService from '@/domain/interface/services/ICacheService';
import IUrl from '@/domain/entities/IUrl';
import IClickAnalytics from '@/domain/entities/IClickAnalytics';
import { GeoLocationResponse } from '@/domain/interface/services/IGeolocationService';
import { OverallAnalyticsResponse, TopicAnalytics } from '@/types';

export class CacheService implements ICacheService {
    private client: RedisClientType;

    private readonly urlCachePrefix = 'url:';
    private readonly analyticsCachePrefix = "analytics:";
    private readonly geoLocationCachePrefix = 'geo:';
    private readonly topicAnalyticsPrefix = "topic:";
    private readonly overallAnalyticsPrefix = "overall:";
    private readonly expTime = 3600;

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
        } catch (error) {
            logger.error(`Failed to connect to Redis: ${error}`);
        }
    }

    private async setCache<T>(key: string, value: T, expTime: number = this.expTime): Promise<void> {
        try {
            await this.client.set(key, JSON.stringify(value), { EX: expTime });
        } catch (error) {
            logger.error(`Failed to set cache for key ${key}: ${error}`);
        }
    }

    private async getCache<T>(key: string): Promise<T | null> {
        try {
            const data = await this.client.get(key);
            return data ? (JSON.parse(data) as T) : null;
        } catch (error) {
            return null;
        }
    }

    private async deleteCache(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (error) {
            logger.error(`Failed to delete cache for key ${key}: ${error}`);
        }
    }


    async cacheUrl(url: IUrl): Promise<void> {
        const key = `${this.urlCachePrefix}${url.shortUrl}`;
        await this.setCache(key, url);
    }

    async getCachedUrl(shortUrl: string): Promise<IUrl | null> {
        const key = `${this.urlCachePrefix}${shortUrl}`;
        return this.getCache<IUrl>(key);
    }

    async invalidateUrlCache(shortUrl: string): Promise<void> {
        const key = `${this.urlCachePrefix}${shortUrl}`;
        await this.deleteCache(key);
    }


    async cacheUrlAnalytics(shortUrl: string, analytics: IClickAnalytics[]): Promise<void> {
        const key = `${this.analyticsCachePrefix}${shortUrl}`;
        await this.setCache(key, analytics);
    }

    async getCachedUrlAnalytics(shortUrl: string): Promise<IClickAnalytics[] | null> {
        const key = `${this.analyticsCachePrefix}${shortUrl}`;
        return this.getCache<IClickAnalytics[]>(key);
    }

    async cacheGeoLocation(geoLocation: GeoLocationResponse): Promise<void> {
        const key = `${this.geoLocationCachePrefix}${geoLocation.ip}`;
        await this.setCache(key, geoLocation, this.expTime * 24);
    }

    async getCachedGeoLocation(ip: string): Promise<GeoLocationResponse | null> {
        const key = `${this.geoLocationCachePrefix}${ip}`;
        return this.getCache<GeoLocationResponse>(key);
    }


    async cacheTopicAnalytics(analytics: TopicAnalytics): Promise<void> {
        const key = `${this.topicAnalyticsPrefix}${analytics.topic}`;
        await this.setCache(key, analytics);
    };

    async getCachedTopicAnalytics(topic: string): Promise<TopicAnalytics | null> {
        const key = `${this.topicAnalyticsPrefix}${topic}`;
        return await this.getCache<TopicAnalytics>(key);
    }

    async cacheOverallAnalytics(userId: string, analytics: OverallAnalyticsResponse): Promise<void> {
        const key = `${this.overallAnalyticsPrefix}${userId}`;
        await this.setCache(key, analytics, this.expTime / 2);
    }

    async getCachedOverallAnalytics(userId: string): Promise<OverallAnalyticsResponse | null> {
        const key = `${this.overallAnalyticsPrefix}${userId}`;
        return await this.getCache<OverallAnalyticsResponse>(key);
    }
}
