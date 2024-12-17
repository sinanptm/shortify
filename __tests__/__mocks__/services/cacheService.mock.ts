import ICacheService from "@/domain/interface/services/ICacheService";

const mockCacheService: jest.Mocked<ICacheService> = {
    cacheUrlAnalytics: jest.fn(),
    cacheGeoLocation: jest.fn(),
    cacheUrl: jest.fn(),
    getCachedUrlAnalytics: jest.fn(),
    getCachedGeoLocation: jest.fn(),
    getCachedUrl: jest.fn(),
    invalidateUrlCache: jest.fn(),
    cacheTopicAnalytics:jest.fn(),
    getCachedTopicAnalytics:jest.fn()
};

export default mockCacheService;