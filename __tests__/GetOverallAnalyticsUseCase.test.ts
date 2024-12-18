import { cachedAnalytics, EMPTY_ANALYTICS, mockAggregatedClicksByDate, mockAnalytics, mockClickData, mockUrls } from "./__mocks__/entities/data.mock";
import mockClickAnalyticsRepository from "./__mocks__/repositories/clickAnalyticsRepository.mock";
import { CachePrefixes, CacheDuration } from "@/domain/interface/services/ICacheService";
import GetOverallAnalyticsUseCase from "@/use_cases/GetOverallAnalyticsUseCase";
import mockUserRepository from "./__mocks__/repositories/userRepository.mock";
import mockUrlRepository from "./__mocks__/repositories/urlRepository.mock";
import mockCacheService from "./__mocks__/services/cacheService.mock";
import { AuthorizationError } from "@/domain/entities/CustomErrors";
import aggregateClicksByDate from "@/utils/aggregateClicksByDate";

jest.mock("@/utils/aggregateClicksByDate", () => ({
    __esModule: true,
    default: jest.fn()
}));


describe("GetOverallAnalyticsUseCase", () => {
    const USER_ID = "exampleUserId";
    const mockUser = { _id: USER_ID, name: "John Doe" };

    let getOverallAnalyticsUseCase: GetOverallAnalyticsUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        (aggregateClicksByDate as jest.Mock).mockReset();
        
        getOverallAnalyticsUseCase = new GetOverallAnalyticsUseCase(
            mockUrlRepository,
            mockCacheService,
            mockUserRepository,
            mockClickAnalyticsRepository
        );
    });

    describe("successful analytics retrieval", () => {
        beforeEach(() => {
            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockCacheService.getCache.mockResolvedValue(null);
            mockUrlRepository.findByUserId.mockResolvedValue(mockUrls);
            mockClickAnalyticsRepository.findByUrlIds.mockResolvedValue(mockClickData);
            mockCacheService.setCache.mockResolvedValue(undefined);
            (aggregateClicksByDate as jest.Mock).mockReturnValue(mockAggregatedClicksByDate);
        });

        it("should retrieve analytics and return correct data", async () => {
            const analytics = await getOverallAnalyticsUseCase.exec(USER_ID);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(USER_ID);
            expect(mockCacheService.getCache).toHaveBeenCalledWith(CachePrefixes.OverallAnalytics, USER_ID);
            expect(mockUrlRepository.findByUserId).toHaveBeenCalledWith(USER_ID);
            expect(mockClickAnalyticsRepository.findByUrlIds).toHaveBeenCalledWith(["url1", "url2"]);
            expect(mockCacheService.setCache).toHaveBeenCalledWith(
                CachePrefixes.OverallAnalytics,
                USER_ID,
                mockAnalytics,
                CacheDuration.ThirtySeconds
            );
            expect(analytics).toEqual(mockAnalytics);
        });
    });

    describe("error handling", () => {
        beforeEach(() => {
            (aggregateClicksByDate as jest.Mock).mockReturnValue([]);
        });

        it("should throw AuthorizationError if user is not found", async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(getOverallAnalyticsUseCase.exec(USER_ID)).rejects.toThrow(new AuthorizationError());

            expect(mockUserRepository.findById).toHaveBeenCalledWith(USER_ID);
            expect(mockCacheService.getCache).not.toHaveBeenCalled();
            expect(mockUrlRepository.findByUserId).not.toHaveBeenCalled();
        });

        it("should return empty analytics if no URLs are found", async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockCacheService.getCache.mockResolvedValue(null);
            mockUrlRepository.findByUserId.mockResolvedValue([]);
            mockClickAnalyticsRepository.findByUrlIds.mockResolvedValue([]);

            const analytics = await getOverallAnalyticsUseCase.exec(USER_ID);

            expect(mockUrlRepository.findByUserId).toHaveBeenCalledWith(USER_ID);
            expect(analytics).toEqual(EMPTY_ANALYTICS);
        });
    });

    describe("cache retrieval", () => {
        it("should return cached analytics if available", async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockCacheService.getCache.mockResolvedValue(cachedAnalytics);

            const analytics = await getOverallAnalyticsUseCase.exec(USER_ID);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(USER_ID);
            expect(mockCacheService.getCache).toHaveBeenCalledWith(CachePrefixes.OverallAnalytics, USER_ID);
            expect(analytics).toEqual(cachedAnalytics);
            expect(mockUrlRepository.findByUserId).not.toHaveBeenCalled();
            expect(mockClickAnalyticsRepository.findByUrlIds).not.toHaveBeenCalled();
        });
    });
});