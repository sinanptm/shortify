import RedirectUseCase from "@/use_cases/RedirectUseCase";
import { NotFoundError } from "@/domain/entities/CustomErrors";
import mockUrlRepository from "./__mocks__/repositories/urlRepository.mock";
import mockClickAnalyticsRepository from "./__mocks__/repositories/clickAnalyticsRepository.mock";
import mockGeolocationService from "./__mocks__/services/geolocationService.mock";
import mockUrl from "./__mocks__/entities/url.mock";
import mockGeoLocation from "./__mocks__/utils/geoLocation.mock";
import mockCacheService from "./__mocks__/services/cacheService.mock";
import { CLIENT_URL } from "@/config/env";
import { CachePrefixes } from "@/domain/interface/services/ICacheService";

describe("RedirectUseCase", () => {
    const IP_ADDRESS = "123.123.123.123";
    const DESKTOP_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

    let redirectUseCase: RedirectUseCase;
    let mockRequest: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRequest = {
            ip: IP_ADDRESS,
            get: jest.fn((header: string) => {
                if (header === 'User-Agent') {
                    return DESKTOP_USER_AGENT;
                }
                return null;
            })
        };

        redirectUseCase = new RedirectUseCase(
            mockUrlRepository,
            mockClickAnalyticsRepository,
            mockGeolocationService,
            mockCacheService
        );
    });

    describe("RedirectUseCase", () => {
        const ALIAS = "exampleAlias";
        const MOBILE_USER_AGENT = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)";
        const FULL_URL = `${CLIENT_URL}/l/${ALIAS}`;

        let redirectUseCase: RedirectUseCase;
        let mockRequest: any;

        beforeEach(() => {
            jest.clearAllMocks();

            mockRequest = {
                ip: IP_ADDRESS,
                get: jest.fn((header: string) => {
                    if (header === 'User-Agent') {
                        return DESKTOP_USER_AGENT;
                    }
                    return null;
                })
            };

            mockCacheService.getCache.mockResolvedValue(null);
            mockCacheService.getCache.mockResolvedValue(mockGeoLocation);

            redirectUseCase = new RedirectUseCase(
                mockUrlRepository,
                mockClickAnalyticsRepository,
                mockGeolocationService,
                mockCacheService
            );
        });

        describe("successful redirect", () => {
            beforeEach(() => {
                mockUrlRepository.findByShortUrl.mockResolvedValue(mockUrl);
                mockGeolocationService.locate.mockResolvedValue(mockGeoLocation);
                mockClickAnalyticsRepository.create.mockResolvedValue({});
                mockUrlRepository.incrementClicks.mockResolvedValue({ ...mockUrl, clicks: mockUrl.clicks! + 1 });
                mockUrlRepository.update.mockResolvedValue(mockUrl);
            });

            it("should return the long URL and track analytics", async () => {
                mockCacheService.getCache.mockResolvedValueOnce(mockUrl);

                const expectedAnalytics = {
                    urlId: mockUrl._id,
                    userId: mockUrl.userId,
                    ipAddress: IP_ADDRESS,
                    userAgent: DESKTOP_USER_AGENT,
                    deviceType: "Desktop",
                    osType: "Windows",
                    browser: "Unknown",
                    country: mockGeoLocation.country,
                    timestamp: expect.any(Date)
                };
                mockCacheService.getCache.mockResolvedValue(expectedAnalytics);

                const result = await redirectUseCase.exec(ALIAS, mockRequest);

                expect(result).toBe(mockUrl.longUrl);
                expect(mockClickAnalyticsRepository.create).toHaveBeenCalledWith(
                    expect.objectContaining(expectedAnalytics)
                );
                expect(mockUrlRepository.incrementClicks).toHaveBeenCalledWith(mockUrl._id);
                expect(mockCacheService.deleteCache).toHaveBeenCalledWith(CachePrefixes.UrlCache, mockUrl.shortUrl);
                expect(mockCacheService.setCache).toHaveBeenCalledWith(CachePrefixes.UrlCache, mockUrl.shortUrl, { ...mockUrl, clicks: mockUrl.clicks! + 1 });
                expect(mockCacheService.getCache).toHaveBeenCalledWith(CachePrefixes.UrlCache, FULL_URL);
            });
            it("should detect mobile devices correctly", async () => {
                mockRequest.get.mockImplementation((header: string) => {
                    if (header === 'User-Agent') {
                        return MOBILE_USER_AGENT;
                    }
                    return null;
                });

                await redirectUseCase.exec(ALIAS, mockRequest);

                expect(mockClickAnalyticsRepository.create).toHaveBeenCalledWith(
                    expect.objectContaining({
                        deviceType: "Mobile",
                        osType: "iOS",
                        userAgent: MOBILE_USER_AGENT
                    })
                );
            });
        });

        describe("error handling", () => {
            it("should throw NotFoundError for non-existent URLs", async () => {
                mockUrlRepository.findByShortUrl.mockResolvedValue(null);
                mockCacheService.getCache.mockResolvedValue(null)

                await expect(redirectUseCase.exec(ALIAS, mockRequest))
                    .rejects.toThrow(new NotFoundError("URL not found"));

                expect(mockClickAnalyticsRepository.create).not.toHaveBeenCalled();
                expect(mockUrlRepository.update).not.toHaveBeenCalled();
                expect(mockCacheService.getCache).toHaveBeenCalledWith(CachePrefixes.UrlCache, FULL_URL);
            });
        });
    });
});