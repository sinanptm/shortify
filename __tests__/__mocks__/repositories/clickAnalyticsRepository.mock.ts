import IClickAnalytics from "@/domain/entities/IClickAnalytics";
import IClickAnalyticsRepository from "@/domain/interface/repositories/IClickAnalyticsRepository";

const mockClickAnalyticsRepository: jest.Mocked<IClickAnalyticsRepository> = {
    create: jest.fn().mockResolvedValue({} as IClickAnalytics),
    findById: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(undefined),
    findByUrlId: jest.fn().mockResolvedValue([]),
    findByUserId: jest.fn().mockResolvedValue([]),
    getUniqueVisitors: jest.fn().mockResolvedValue(0),
    getDeviceAnalytics: jest.fn().mockResolvedValue([]),
    getOsAnalytics: jest.fn().mockResolvedValue([]),
};

export default mockClickAnalyticsRepository;
