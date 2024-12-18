import { AuthorizationError } from "@/domain/entities/CustomErrors";
import IClickAnalyticsRepository from "@/domain/interface/repositories/IClickAnalyticsRepository";
import IUrlRepository from "@/domain/interface/repositories/IUrlRepository";
import IUserRepository from "@/domain/interface/repositories/IUserRepository";
import ICacheService from "@/domain/interface/services/ICacheService";
import IUser from "@/domain/entities/IUser";
import { OverallAnalyticsResponse } from "@/types";
import aggregateClicksByDate from "@/utils/aggregateClicksByDate";
import IClickAnalytics from "@/domain/entities/IClickAnalytics";

export default class GetOverallAnalyticsUseCase {
    constructor(
        private readonly urlRepository: IUrlRepository,
        private readonly cacheService: ICacheService,
        private readonly userRepository: IUserRepository,
        private readonly clickAnalyticsRepository: IClickAnalyticsRepository
    ) { }

    async exec(userId: string): Promise<OverallAnalyticsResponse> {
        const user = await this.validateUser(userId);

        const cachedAnalytics = await this.cacheService.getCachedOverallAnalytics(userId);
        if (cachedAnalytics) {
            return cachedAnalytics;
        }

        const userUrls = await this.urlRepository.findByUserId(userId);
        const urlIds = userUrls.map(url => url._id!);

        const clickAnalytics = await this.clickAnalyticsRepository.findByUrlIds(urlIds);

        const overallAnalytics: OverallAnalyticsResponse = {
            totalUrls: userUrls.length,
            totalClicks: clickAnalytics.length,
            uniqueClicks: new Set(clickAnalytics.map(click => click.ipAddress)).size,
            clicksByDate: aggregateClicksByDate(clickAnalytics),
            osType: this.aggregateOsAnalytics(clickAnalytics),
            deviceType: this.aggregateDeviceAnalytics(clickAnalytics)
        };

        await this.cacheService.cacheOverallAnalytics(userId, overallAnalytics);

        return overallAnalytics;
    }

    private async validateUser(userId: string): Promise<IUser> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new AuthorizationError();

        return user;
    }

    private aggregateOsAnalytics(clickAnalytics: IClickAnalytics[]) {
        const osAnalytics: { [key: string]: { uniqueClicks: Set<string>, totalClicks: number; }; } = {};

        clickAnalytics.forEach(click => {
            const osType = click.osType || 'Unknown';

            if (!osAnalytics[osType]) {
                osAnalytics[osType] = {
                    uniqueClicks: new Set(),
                    totalClicks: 0
                };
            }

            osAnalytics[osType].uniqueClicks.add(click.ipAddress || '');
            osAnalytics[osType].totalClicks++;
        });

        return Object.entries(osAnalytics).map(([osName, data]) => ({
            osName,
            uniqueClicks: data.uniqueClicks.size,
            uniqueUsers: data.uniqueClicks.size
        }));
    }

    private aggregateDeviceAnalytics(clickAnalytics: IClickAnalytics[]) {
        const deviceAnalytics: { [key: string]: { uniqueClicks: Set<string>, totalClicks: number; }; } = {};

        clickAnalytics.forEach(click => {
            const deviceType = click.deviceType || 'Unknown';

            if (!deviceAnalytics[deviceType]) {
                deviceAnalytics[deviceType] = {
                    uniqueClicks: new Set(),
                    totalClicks: 0
                };
            }

            deviceAnalytics[deviceType].uniqueClicks.add(click.ipAddress || '');
            deviceAnalytics[deviceType].totalClicks++;
        });

        return Object.entries(deviceAnalytics).map(([deviceName, data]) => ({
            deviceName,
            uniqueClicks: data.uniqueClicks.size,
            uniqueUsers: data.uniqueClicks.size
        }));
    }
}