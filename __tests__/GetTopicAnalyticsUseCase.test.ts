import GetTopicAnalyticsUseCase from "@/use_cases/GetTopicAnalyticsUseCase";
import { NotFoundError } from "@/domain/entities/CustomErrors";
import mockUrlRepository from "./__mocks__/repositories/urlRepository.mock";
import mockClickAnalyticsRepository from "./__mocks__/repositories/clickAnalyticsRepository.mock";
import mockCacheService from "./__mocks__/services/cacheService.mock";

describe("GetTopicAnalyticsUseCase", () => {
    const TOPIC = "exampleTopic";

    let getTopicAnalyticsUseCase: GetTopicAnalyticsUseCase;

    beforeEach(() => {
        jest.clearAllMocks();

        getTopicAnalyticsUseCase = new GetTopicAnalyticsUseCase(
            mockUrlRepository,
            mockClickAnalyticsRepository,
            mockCacheService
        );
    });

    describe("successful analytics retrieval", () => {
        const mockUrls = [
            { _id: "url1", totalClicks: 100, uniqueClicks: 80, shortUrl: "shortUrl1" },
            { _id: "url2", totalClicks: 150, uniqueClicks: 120, shortUrl: "shortUrl2" }
        ];
    
        const mockClickData = [
            { timestamp: new Date().toISOString(), urlId: "url1" },
            { timestamp: new Date().toISOString(), urlId: "url1" },
            { timestamp: new Date().toISOString(), urlId: "url2" },
            { timestamp: new Date().toISOString(), urlId: "url2" }
        ];
    
        const mockAggregatedClickData = [
            { date: new Date().toISOString().split("T")[0], count: 4 }
        ];
    
        beforeEach(() => {
            mockCacheService.getCachedTopicAnalytics.mockResolvedValue(null);
            mockUrlRepository.findByTopic.mockResolvedValue(mockUrls);
            mockClickAnalyticsRepository.findByUrlIds.mockResolvedValue(mockClickData); 
            mockCacheService.cacheTopicAnalytics.mockResolvedValue(undefined);
        });
    
        it("should retrieve analytics and return correct data", async () => {
            const analytics = await getTopicAnalyticsUseCase.exec(TOPIC);
    
            expect(mockUrlRepository.findByTopic).toHaveBeenCalledWith(TOPIC);
            expect(mockClickAnalyticsRepository.findByUrlIds).toHaveBeenCalledWith(["url1", "url2"]);
            expect(mockCacheService.cacheTopicAnalytics).toHaveBeenCalled();
            expect(analytics).toEqual({
                topic: TOPIC,
                urls: [
                    { totalClicks: 100, uniqueClicks: 80, shortUrl: "shortUrl1" },
                    { totalClicks: 150, uniqueClicks: 120, shortUrl: "shortUrl2" }
                ],
                totalClicks: 250,
                uniqueClicks: 200,
                clicksByDate: mockAggregatedClickData
            });
        });
    });
    

    describe("error handling", () => {
        it("should throw NotFoundError when no URLs are found for the topic", async () => {
            mockCacheService.getCachedTopicAnalytics.mockResolvedValue(null);
            mockUrlRepository.findByTopic.mockResolvedValue([]);

            await expect(getTopicAnalyticsUseCase.exec(TOPIC))
                .rejects.toThrow(new NotFoundError("Topic Not Found"));

            expect(mockUrlRepository.findByTopic).toHaveBeenCalledWith(TOPIC);
            expect(mockClickAnalyticsRepository.findByUrlIds).not.toHaveBeenCalled();
        });
    });

    describe("cache retrieval", () => {
        it("should return cached analytics if available", async () => {
            const cachedAnalytics = {
                topic: TOPIC,
                urls: [
                    { shortUrl: "shortUrl1", totalClicks: 100, uniqueClicks: 80 },
                    { shortUrl: "shortUrl2", totalClicks: 150, uniqueClicks: 120 }
                ],
                totalClicks: 250,
                uniqueClicks: 200,
                clicksByDate: [
                    { date: "2024-12-10", count: 30 },
                    { date: "2024-12-11", count: 50 }
                ]
            };

            mockCacheService.getCachedTopicAnalytics.mockResolvedValue(cachedAnalytics);

            const analytics = await getTopicAnalyticsUseCase.exec(TOPIC);

            expect(analytics).toEqual(cachedAnalytics);
            expect(mockUrlRepository.findByTopic).not.toHaveBeenCalled();
            expect(mockClickAnalyticsRepository.findByUrlIds).not.toHaveBeenCalled();
        });
    });
});
