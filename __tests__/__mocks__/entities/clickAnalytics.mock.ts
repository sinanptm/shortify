import IClickAnalytics from "@/domain/entities/IClickAnalytics";

const mockClickAnalytics: IClickAnalytics = {
    _id: '63f1eae81234567890123456',
    urlId: '63f1eaee1234567890123456',
    userId: '63f1eaf01234567890123456',
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    deviceType: 'Desktop',
    osType: 'Windows',
    browser: 'Chrome',
    country: 'United States',
    referrer: 'https://example.com',
};

export default mockClickAnalytics;
