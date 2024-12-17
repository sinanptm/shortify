import ICacheService from "@/domain/interface/services/ICacheService";

const mockCacheService: jest.Mocked<ICacheService> = {
    cacheAnalytics: jest.fn(),
    cacheGeoLocation: jest.fn(),
    cacheUrl: jest.fn(),
    getCachedAnalytics: jest.fn(),
    getCachedGeoLocation: jest.fn(),
    getCachedUrl: jest.fn(),
    invalidateUrlCache: jest.fn()
};

export default mockCacheService;