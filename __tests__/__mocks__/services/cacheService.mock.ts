import ICacheService from "@/domain/interface/services/ICacheService";

const mockCacheService: jest.Mocked<ICacheService> = {
   clearCacheByPrefix:jest.fn(),
   deleteCache:jest.fn(),
   getCache:jest.fn(),
   setCache:jest.fn()
};

export default mockCacheService;