import { Request } from 'express';
import IUrlRepository from "@/domain/interface/repositories/IUrlRepository";
import IClickAnalyticsRepository from "@/domain/interface/repositories/IClickAnalyticsRepository";
import IGeolocationService, { GeoLocationResponse } from "@/domain/interface/services/IGeolocationService";
import { NotFoundError } from "@/domain/entities/CustomErrors";
import IUrl from '@/domain/entities/IUrl';
import IClickAnalytics from '@/domain/entities/IClickAnalytics';
import ICacheService from '@/domain/interface/services/ICacheService';

export default class RedirectUseCase {
    constructor(
        private readonly urlRepository: IUrlRepository,
        private readonly clickAnalyticsRepository: IClickAnalyticsRepository,
        private readonly geolocationService: IGeolocationService,
        private readonly cacheService: ICacheService
    ) { }

    async exec(alias: string, request: Request): Promise<string> {
        const url = await this.findUrlByAlias(alias);
        const analyticsData = await this.prepareAnalyticsData(url, request);
        const [updatedUrl] = await Promise.all([
            this.urlRepository.incrementClicks(url._id!),
            this.clickAnalyticsRepository.create(analyticsData)
        ]);

        await this.cacheService.invalidateUrlCache(url.shortUrl!);
        await this.cacheService.cacheUrl(updatedUrl!);

        return url.longUrl!;
    }

    private async findUrlByAlias(alias: string): Promise<IUrl> {
        const fullUrl = `${process.env.CLIENT_URL}/l/${alias}`;
        let url = await this.cacheService.getCachedUrl(fullUrl);

        if (url) return url;

        url = await this.urlRepository.findByShortUrl(fullUrl);

        if (!url) {
            throw new NotFoundError('URL not found');
        }

        return url;
    }

    private async prepareAnalyticsData(url: IUrl, request: Request): Promise<IClickAnalytics> {
        const ipAddress = this.extractIpAddress(request);
        const userAgent = request.get('User-Agent') || 'Unknown';
        const geoLocation = await this.getGeoLocation(ipAddress);

        return {
            urlId: url._id,
            userId: url.userId,
            ipAddress,
            userAgent,
            deviceType: this.detectDeviceType(userAgent),
            osType: this.detectOsType(userAgent),
            browser: this.detectBrowserType(userAgent),
            country: geoLocation?.country || 'Unknown',
            timestamp: new Date()
        };
    }

    private async getGeoLocation(ipAddress: string): Promise<GeoLocationResponse | null> {
        let geoLocation = await this.cacheService.getCachedGeoLocation(ipAddress);

        if (geoLocation) return geoLocation;

        geoLocation = await this.geolocationService.locate(ipAddress);
        if (geoLocation) {
            await this.cacheService.cacheGeoLocation(geoLocation);
        }

        return geoLocation;
    }

    private extractIpAddress(request: Request): string {
        return (
            request.ip ||
            (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
            request.socket.remoteAddress ||
            '0.0.0.0'
        );
    }

    private detectDeviceType(userAgent: string): string {
        if (/iphone|ipad|android|mobile|phone/i.test(userAgent)) return 'Mobile';
        if (/tablet/i.test(userAgent)) return 'Tablet';
        return 'Desktop';
    }

    private detectOsType(userAgent: string): string {
        if (/iphone|ipad|ios/i.test(userAgent)) return 'iOS';
        if (/android/i.test(userAgent)) return 'Android';
        if (/windows/i.test(userAgent)) return 'Windows';
        if (/macintosh|mac os/i.test(userAgent)) return 'macOS';
        if (/linux/i.test(userAgent)) return 'Linux';
        return 'Unknown';
    }

    private detectBrowserType(userAgent: string): string {
        if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) return 'Chrome';
        if (/firefox/i.test(userAgent)) return 'Firefox';
        if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
        if (/edge/i.test(userAgent)) return 'Edge';
        if (/msie|trident/i.test(userAgent)) return 'Internet Explorer';
        return 'Unknown';
    }
}