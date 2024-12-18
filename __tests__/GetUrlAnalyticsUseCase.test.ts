import GetUrlAnalyticsUseCase from "@/use_cases/GetUrlAnalyticsUseCase";
import { NotFoundError } from "@/domain/entities/CustomErrors";
import { CLIENT_URL } from "@/config/env";
import mockUrlRepository from "./__mocks__/repositories/urlRepository.mock";
import mockClickAnalyticsRepository from "./__mocks__/repositories/clickAnalyticsRepository.mock";
import mockCacheService from "./__mocks__/services/cacheService.mock";
import { CachePrefixes } from "@/domain/interface/services/ICacheService";

describe("GetUrlAnalyticsUseCase", () => {
    const ALIAS = "testAlias";
    const FULL_URL = `${CLIENT_URL}/l/${ALIAS}`;
    
    let getUrlAnalyticsUseCase: GetUrlAnalyticsUseCase;

    beforeEach(() => {
        jest.clearAllMocks();

        getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(
            mockUrlRepository,
            mockClickAnalyticsRepository,
            mockCacheService
        );
    });

    describe("successful analytics retrieval", () => {
        const mockUrl = {
            _id: "urlId123",
            shortUrl: FULL_URL,
            customAlias: ALIAS
        };

        const mockClickAnalytics = [
            { timestamp: new Date().toISOString(), urlId: "urlId123" },
            { timestamp: new Date().toISOString(), urlId: "urlId123" }
        ];

        const mockDeviceAnalytics = [
            { device: 'mobile', count: 10 },
            { device: 'desktop', count: 20 }
        ];

        const mockOsAnalytics = [
            { os: 'windows', count: 15 },
            { os: 'mac', count: 15 }
        ];

        beforeEach(() => {
            mockCacheService.getCache
                .mockResolvedValueOnce(null) 
                .mockResolvedValueOnce(null); 
            mockUrlRepository.findByCustomAlias.mockResolvedValue(mockUrl);
            mockClickAnalyticsRepository.findByUrlId.mockResolvedValue(mockClickAnalytics);
            mockClickAnalyticsRepository.getUniqueVisitors.mockResolvedValue(2);
            mockClickAnalyticsRepository.getDeviceAnalytics.mockResolvedValue(mockDeviceAnalytics);
            mockClickAnalyticsRepository.getOsAnalytics.mockResolvedValue(mockOsAnalytics);

            mockCacheService.setCache.mockResolvedValue(undefined);
        });

        it("should retrieve and return URL analytics correctly", async () => {
            const analytics = await getUrlAnalyticsUseCase.exec(ALIAS);
            expect(mockUrlRepository.findByCustomAlias).toHaveBeenCalledWith(ALIAS);
            expect(mockClickAnalyticsRepository.findByUrlId).toHaveBeenCalledWith(mockUrl._id);
            
            expect(analytics).toEqual({
                totalClicks: 2,
                uniqueClicks: 2,
                clicksByDate: expect.any(Array),
                osType: mockOsAnalytics,
                deviceType: mockDeviceAnalytics
            });

            expect(mockCacheService.setCache).toHaveBeenCalledWith(
                CachePrefixes.AnalyticsCache, 
                FULL_URL, 
                mockClickAnalytics
            );
        });
    });

    describe("error handling", () => {
        it("should throw NotFoundError when URL is not found", async () => {
            mockCacheService.getCache.mockResolvedValue(null);

            mockUrlRepository.findByCustomAlias.mockResolvedValue(null);

            await expect(getUrlAnalyticsUseCase.exec(ALIAS))
                .rejects.toThrow(new NotFoundError("URL not found"));

            expect(mockUrlRepository.findByCustomAlias).toHaveBeenCalledWith(ALIAS);
        });
    });

    describe("cache retrieval", () => {
        const mockCachedUrl = {
            _id: "urlId123",
            shortUrl: FULL_URL,
            customAlias: ALIAS
        };

        const mockCachedAnalytics = [
            { timestamp: new Date().toISOString(), urlId: "urlId123" }
        ];

        it("should return cached URL and analytics if available", async () => {
            mockCacheService.getCache
                .mockResolvedValueOnce(mockCachedUrl) 
                .mockResolvedValueOnce(mockCachedAnalytics);

                mockClickAnalyticsRepository.getUniqueVisitors.mockResolvedValue(1);
            mockClickAnalyticsRepository.getDeviceAnalytics.mockResolvedValue([]);
            mockClickAnalyticsRepository.getOsAnalytics.mockResolvedValue([]);

            const analytics = await getUrlAnalyticsUseCase.exec(ALIAS);

            expect(mockUrlRepository.findByCustomAlias).not.toHaveBeenCalled();
            expect(mockClickAnalyticsRepository.findByUrlId).toHaveBeenCalled();
            expect(analytics).toEqual(expect.objectContaining({
                totalClicks: expect.any(Number),
                uniqueClicks: expect.any(Number),
                clicksByDate: expect.any(Array),
                osType: expect.any(Array),
                deviceType: expect.any(Array)
            }));
        });
    });

    describe("clicks by date", () => {
        const mockUrl = {
            _id: "urlId123",
            shortUrl: FULL_URL,
            customAlias: ALIAS
        };

        const mockClickAnalytics = [
            { timestamp: new Date().toISOString(), urlId: "urlId123" },
            { 
                timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), 
                urlId: "urlId123" 
            }
        ];

        beforeEach(() => {
            mockCacheService.getCache
                .mockResolvedValueOnce(null) 
                .mockResolvedValueOnce(null);

            mockUrlRepository.findByCustomAlias.mockResolvedValue(mockUrl);
            mockClickAnalyticsRepository.findByUrlId.mockResolvedValue(mockClickAnalytics);
            mockClickAnalyticsRepository.getUniqueVisitors.mockResolvedValue(2);
            mockClickAnalyticsRepository.getDeviceAnalytics.mockResolvedValue([]);
            mockClickAnalyticsRepository.getOsAnalytics.mockResolvedValue([]);
        });

        it("should filter clicks from last 7 days", async () => {
            const analytics = await getUrlAnalyticsUseCase.exec(ALIAS);
            expect(analytics.clicksByDate).toEqual(expect.any(Array));
            expect(analytics.clicksByDate.length).toBeGreaterThan(0);
        });
    });
});